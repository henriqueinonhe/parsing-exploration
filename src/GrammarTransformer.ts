import { Grammar } from "./Grammar";
import { TokenString } from "./TokenString";
import { ProductionRule } from "./ProductionRule";
import { Token } from "./Token";
import { ContextFreeGrammarAnalyzer } from "./ContextFreeGrammarAnalyzer";
import { TokenTable } from "./TokenTable";

export class GrammarTransformer
{
  public static cleanGrammar(grammar : Grammar) : Grammar
  {
    const analyzer = new ContextFreeGrammarAnalyzer(grammar);
    const unreachableTokens = analyzer.computeUnreachableTokens();

    const tokenTable = grammar.getTokenTable();
    const rules = grammar.getRules();
    const startSymbol = grammar.getStartSymbol();
    
    GrammarTransformer.removeUnusedTokensFromTable(tokenTable, unreachableTokens);
    GrammarTransformer.removeUnusedRules(rules, unreachableTokens);

    return new Grammar(tokenTable, rules, startSymbol);
  }

  private static removeUnusedTokensFromTable(tokenTable : TokenTable, unusedTokens : Array<string>) : void
  {
    for(const token in tokenTable)
    {
      if(unusedTokens.includes(token))
      {
        delete tokenTable[token];
      }
    }
  }

  private static removeUnusedRules(rules : Array<ProductionRule>, unreachableTokens : Array<string>) : void
  {
    const newRules = [] as Array<ProductionRule>;
    for(const rule of rules)
    {
      if(!unreachableTokens.includes(rule.getLhs().toString()))
      {
        newRules.push(rule);
      }
    }
    rules = newRules;
    //FIXME!
  }

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
          const isStartingRule = !rule.getLhs().tokenAt(0).isEqual(startSymbol);
          GrammarTransformer.substituteERuleLhsOccurrencesInRules(newRules, rule.getLhs());

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
        if(option.includes(eRuleLhs)) //Rule has the form xAy, where x and y are strings of tokens and either x or y is non empty (at least one of them) and A is the E rule lhs non terminal
        {
          newOptions.push(...GrammarTransformer.generateNonUnitRuleOptions(eRuleLhs, option));
        }
      }
      const newRhs = [...rule.getRhs()];
      newRhs.push(...newOptions);
      rule.setRhs(newRhs);
    }
  }

  private static generateNonUnitRuleOptions(eRuleLhs : TokenString, option : TokenString) : Array<TokenString>
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