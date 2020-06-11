import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { ProductionRule } from "../Core/ProductionRule";
import { Token } from "../Core/Token";
import { ContextFreeGrammarAnalyzer } from "../Analyzers/ContextFreeGrammarAnalyzer";
import { TokenSortTable } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

export class ContextFreeGrammarTransformer
{
  // public static removeUnitRules(grammar : Grammar) : Grammar
  // {

  // }

  /**
   * Returns a new grammar with non productive options, 
   * rules and non terminals as well as unreachable tokens
   * and rules are removed.
   * 
   * @param grammar 
   */
  public static cleanGrammar(grammar : Grammar) : Grammar
  {
    const analyzer = new ContextFreeGrammarAnalyzer(grammar);
    const unreachableTokens = analyzer.computeUnreachableTokens();
    const nonProductiveNonTerminals = analyzer.computeNonProductiveNonTerminals();
    const uselessTokens = [...unreachableTokens, ...nonProductiveNonTerminals];
    const cleanTokenSortTable = this.removeUselessTokensFromSortTable(grammar.getTokenSortTable(), uselessTokens);
    const cleanRules = this.removeUselessRules(grammar.getRules(), uselessTokens);
    const startSymbol = grammar.getStartSymbol();
    
    return new Grammar(cleanTokenSortTable, cleanRules, startSymbol);
  }

  /**
   * Returns a token table copy with unreachable tokens 
   * removed. Doesn't modify original.
   * 
   * @param tokenTable 
   * @param unusedTokens 
   */
  private static removeUselessTokensFromSortTable(tokenTable : TokenSortTable, unusedTokens : Array<string>) : TokenSortTable
  {
    const newTokenTable = {} as TokenSortTable;

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
   * @param uselessTokens 
   */
  private static removeUselessRules(rules : Array<ProductionRule>, uselessTokens : Array<string>) : Array<ProductionRule>
  {
    const newRules = [] as Array<ProductionRule>;
    const cleanOptionsRules = rules.map(rule => this.removeUselessOptions(rule, uselessTokens)).filter(rule => rule !== undefined);

    for(const rule of cleanOptionsRules)
    {
      if(!uselessTokens.includes((rule as ProductionRule).getLhs().toString()))
      {
        newRules.push((rule as ProductionRule));
      }
    }
    return newRules;
  }

  private static removeUselessOptions(rule : ProductionRule, uselessTokens : Array<string>) : ProductionRule | undefined
  {
    const newRhs = [];
    for(const option of rule.getRhs())
    {
      if(option.every(token => !uselessTokens.includes(token.toString())))
      {
        newRhs.push(option);
      }
    }

    if(newRhs.length === 0)
    {
      return undefined;
    }
    else
    {
      return new ProductionRule(rule.getLhs(), newRhs);
    }
  }

  /**
   * Returns a new grammar with all E rules removed,
   * but preserving weak grammar equivalence. Doesn't modify original.
   * 
   * @param grammar 
   */
  public static removeERules(grammar : Grammar) : Grammar
  {
    const tokenTable = grammar.getTokenSortTable();
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
          ContextFreeGrammarTransformer.substituteERuleLhsOccurrencesInRules(newRules, rule.getLhs());
          
          const isStartingRule = rule.getLhs().tokenAt(0).isEqual(startSymbol);
          if(!isStartingRule)
          {
            eRulesNoMore = false;
            ContextFreeGrammarTransformer.removeEmptyStringFromRule(rule);
          }
        }
      }

    } while(!eRulesNoMore);

    return new Grammar(tokenTable, newRules, startSymbol);
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
          newOptions.push(...ContextFreeGrammarTransformer.generateERuleSubstitutionOptions(eRuleLhs, option));
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
    const eRuleLhsNonTerminalIndicatorList = ContextFreeGrammarTransformer.generateIndicatorList(eRuleLhsNonTerminalOccurrenceCount);

    for(const indicator of eRuleLhsNonTerminalIndicatorList)
    {
      const newOption = ContextFreeGrammarTransformer.generateNonUnitRuleOptionTokenString(eRuleLhsNonTerminal, option, indicator);
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
      ContextFreeGrammarTransformer.advanceToNextIndicator(indicator);
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