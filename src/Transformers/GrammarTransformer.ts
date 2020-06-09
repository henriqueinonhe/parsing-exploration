import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { ProductionRule } from "../Core/ProductionRule";
import { Token } from "../Core/Token";
import { ContextFreeGrammarAnalyzer } from "../Analyzers/ContextFreeGrammarAnalyzer";
import { TokenTable } from "../Core/TokenTable";
import { Utils } from "../Core/Utils";

export class GrammarTransformer
{
  /**
   * Returns a new grammar where unreachable tokens
   * are removed from the token table and unused rules
   * are also removed. Doesn't modify original.
   * 
   * @param grammar 
   */
  public static cleanGrammar(grammar : Grammar) : Grammar
  {
    const analyzer = new ContextFreeGrammarAnalyzer(grammar);
    const unreachableTokens = analyzer.computeUnreachableTokens();

    const tokenTable = grammar.getTokenTable();
    const rules = grammar.getRules();
    const startSymbol = grammar.getStartSymbol();
    
    const cleanedTokenTable = GrammarTransformer.removeUnusedTokensFromTable(tokenTable, unreachableTokens);
    const cleanedRules = GrammarTransformer.removeUnusedRules(rules, unreachableTokens);

    //Maybe should also remove unused options...
    return new Grammar(cleanedTokenTable, cleanedRules, startSymbol);
  }

  /**
   * Returns a token table copy with unreachable tokens 
   * removed. Doesn't modify original.
   * 
   * @param tokenTable 
   * @param unusedTokens 
   */
  private static removeUnusedTokensFromTable(tokenTable : TokenTable, unusedTokens : Array<string>) : TokenTable
  {
    const newTokenTable = {} as TokenTable;

    for(const token in tokenTable)
    {
      if(!unusedTokens.includes(token))
      {
        newTokenTable[token] = tokenTable[token];
      }
    }
    return newTokenTable;
  }

  /**
   * Returns a list of rules with unused rules
   * removed. Doesn't modify original.
   * 
   * @param rules 
   * @param unreachableTokens 
   */
  private static removeUnusedRules(rules : Array<ProductionRule>, unreachableTokens : Array<string>) : Array<ProductionRule>
  {
    const newRules = [] as Array<ProductionRule>;
    for(const rule of rules)
    {
      if(!unreachableTokens.includes(rule.getLhs().toString()))
      {
        newRules.push(rule);
      }
    }
    return newRules;
  }

  /**
   * Returns a new grammar with all E rules removed,
   * but preserving weak grammar equivalence. Doesn't modify original.
   * 
   * @param grammar 
   */
  public static removeERules(grammar : Grammar) : Grammar
  {
    const tokenTable = grammar.getTokenTable();
    const newRules = grammar.getRules();
    const startSymbol = grammar.getStartSymbol();

    let eRulesNoMore = false;
    do
    {
      eRulesNoMore = true;

      for(const rule of newRules)
      {
        if(rule.isERule(tokenTable)) 
        {
          GrammarTransformer.substituteERuleLhsOccurrencesInRules(newRules, rule.getLhs());
          
          const isStartingRule = rule.getLhs().tokenAt(0).isEqual(startSymbol);
          if(!isStartingRule)
          {
            eRulesNoMore = false;
            GrammarTransformer.removeEmptyStringFromRule(rule);
          }
        }
      }

    } while(!eRulesNoMore);

    //Construct and clean grammar
    const eFreeGrammar = new Grammar(tokenTable, newRules, startSymbol);
    return GrammarTransformer.cleanGrammar(eFreeGrammar);
  }

  private static removeEmptyStringFromRule(rule : ProductionRule) : void
  {
    rule.setRhs(rule.getRhs().filter(tokenString => !tokenString.isEmpty()));
  }

  private static substituteERuleLhsOccurrencesInRules(rules : Array<ProductionRule>, eRuleLhs : TokenString) : void
  {
    for(const rule of rules)
    {
      const newOptions = [];

      for(const option of rule.getRhs())
      {
        if(option.includes(eRuleLhs)) 
        {
          newOptions.push(...GrammarTransformer.generateERuleSubstitutionOptions(eRuleLhs, option));
        }
      }
      const newRhs = [...rule.getRhs()];
      newRhs.push(...newOptions);
      const newRhsWithoutDuplicates = Utils.removeArrayDuplicates(newRhs, (option1, option2) => option1.isEqual(option2));
      rule.setRhs(newRhsWithoutDuplicates);

    }
  }

  private static generateERuleSubstitutionOptions(eRuleLhs : TokenString, option : TokenString) : Array<TokenString>
  {
    const newOptions = [];
    const eRuleLhsNonTerminal = eRuleLhs.tokenAt(0);
    const eRuleLhsNonTerminalOccurrenceCount = option.reduce((count, token) => token.isEqual(eRuleLhsNonTerminal) ? count + 1 : count, 0);
    const eRuleLhsNonTerminalIndicatorList = GrammarTransformer.generateIndicatorList(eRuleLhsNonTerminalOccurrenceCount);

    for(const indicator of eRuleLhsNonTerminalIndicatorList)
    {
      const newOption = GrammarTransformer.generateNonUnitRuleOptionTokenString(eRuleLhsNonTerminal, option, indicator);
      newOptions.push(newOption);
    }
    return newOptions;
  }

  private static generateIndicatorList(size : number) : Array<Array<boolean>>
  {
    if(size <= 0)
    {
      throw new Error("Indicator list size must be > 0!");
    }

    const indicator = new Array(size).fill(false);
    const indicatorList = [indicator.slice()];
    const indicatorListEntries =  Math.pow(2, size); //Indicator list is a a list of consecutive numbers in base 2 (binary)
    for(let indicatorCount = 2; indicatorCount <= indicatorListEntries; indicatorCount++)
    {
      GrammarTransformer.advanceToNextIndicator(indicator);
      indicatorList.push(indicator.slice());
    }
    return indicatorList;
  }

  private static advanceToNextIndicator(indicator : Array<boolean>) : void
  {
    let index = 0;
    while(indicator[index] && index < indicator.length)
    {
      index++;
    }

    if(index === indicator.length)
    {
      throw new Error("Already at the last possible indicator!");
    }

    indicator[index] = true;
    for(let j = 0; j < index; j++)
    {
      indicator[j] = false;
    }
  }

  private static generateNonUnitRuleOptionTokenString(eRuleLhsNonTerminal : Token, option : TokenString, indicator : Array<boolean>) : TokenString
  {
    const tokenList = [];
    let indicatorIndex = 0;
    for(let index = 0; index < option.size(); index++)
    {
      const currentToken = option.tokenAt(index);
      if(currentToken.isEqual(eRuleLhsNonTerminal))
      {
        if(indicator[indicatorIndex])
        {
          tokenList.push(currentToken);
        }
        indicatorIndex++;
      }
      else
      {
        tokenList.push(currentToken);
      }
    }
    return new TokenString(tokenList);
  }

}