import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { ProductionRule } from "../Core/ProductionRule";
import { Token } from "../Core/Token";
import { ContextFreeGrammarAnalyzer } from "../Analyzers/ContextFreeGrammarAnalyzer";
import { TokenSortTable, TokenSort } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

export class ContextFreeGrammarTransformer
{
  public static removeUnitRules(grammar : Grammar) : Grammar
  {
    const rules = grammar.getRules();
    const tokenSortTable = grammar.getTokenSortTable();

    //First we need to remove all direct loops from rules
    const rulesWithoutDirectLoops = [];
    for(const rule of rules)
    {
      const newOptions = [];
      for(const option of rule.getRhs())
      {
        const isDirectLoopOption = rule.getLhs().isEqual(option);
        if(!isDirectLoopOption)
        {
          newOptions.push(option);
        }
      }
      rulesWithoutDirectLoops.push(new ProductionRule(rule.getLhs(), newOptions));
    }

    const rulesWithoutUnitRules = [];
    for(const rule of rulesWithoutDirectLoops)
    {
      const newOptions = [];
      for(const option of rule.getRhs())
      {
        const isUnitOption = option.size() === 1 && tokenSortTable[option.toString()] === TokenSort.NonTerminal;
        if(isUnitOption)
        {
          const nonTerminalAssociatedRule = rulesWithoutDirectLoops.find(rule => rule.getLhs().isEqual(option));
          if(nonTerminalAssociatedRule !== undefined)
          {
            newOptions.push(... this.generateNonTerminalSubstitutionOptions(nonTerminalAssociatedRule, option));
          }
        }
        else
        {
          newOptions.push(option);
        }
      }
      rulesWithoutUnitRules.push(new ProductionRule(rule.getLhs(), newOptions));
    }

    return new Grammar(tokenSortTable, rulesWithoutUnitRules, grammar.getStartSymbol());
  }

  public static substituteNonTerminalIntoRule(nonTerminalAssociatedRule : ProductionRule, ruleToBeSubstitutedInto : ProductionRule) : ProductionRule
  {
    const newRhs = [];
    for(const option of ruleToBeSubstitutedInto.getRhs())
    {
      newRhs.push(... this.generateNonTerminalSubstitutionOptions(nonTerminalAssociatedRule, option));
    }

    return new ProductionRule(ruleToBeSubstitutedInto.getLhs(), newRhs);
  }

  /**
   * Generates all possible options where
   * every occurence of a given non terminal
   * is expanded into its associated rule options.
   * 
   * @param nonTerminalAssociatedRule 
   * @param option 
   */
  public static generateNonTerminalSubstitutionOptions(nonTerminalAssociatedRule : ProductionRule, option : TokenString) : Array<TokenString>
  {
    //Count non terminal occurrences within option
    const nonTerminal = nonTerminalAssociatedRule.getLhs().tokenAt(0);
    const nonTerminalOccurrencesWithinOption = option.reduce((accum, token) => token.isEqual(nonTerminal) ? accum + 1 : accum, 0);

    const nonTerminalsAssociatedRuleOptions = nonTerminalAssociatedRule.getRhs();
    const optionChoiceIndexesList = Utils.generateAllNumbersAsArrayInBase(nonTerminalsAssociatedRuleOptions.length, nonTerminalOccurrencesWithinOption);
    const generatedOptions = [];

    for(const optionChoiceIndexes of optionChoiceIndexesList)
    {
      const substitutedOptionTokenList : Array<Token> = [];
      let nonTerminalOccurrenceCount = 0;
      for(const token of option.getTokenList())
      {
        if(token.isEqual(nonTerminal))
        {
          const optionToInsert = nonTerminalsAssociatedRuleOptions[optionChoiceIndexes[nonTerminalOccurrenceCount]];
          substitutedOptionTokenList.push(...optionToInsert.getTokenList());
          nonTerminalOccurrenceCount++;
        }
        else
        {
          substitutedOptionTokenList.push(token);
        }
      }
      generatedOptions.push(new TokenString(substitutedOptionTokenList));
    }

    return generatedOptions;
  }

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
   * @param tokenSortTable 
   * @param unusedTokens 
   */
  private static removeUselessTokensFromSortTable(tokenSortTable : TokenSortTable, unusedTokens : Array<string>) : TokenSortTable
  {
    const newtokenSortTable = {} as TokenSortTable;

    for(const token in tokenSortTable)
    {
      if(!unusedTokens.includes(token))
      {
        newtokenSortTable[token] = tokenSortTable[token];
      }
    }
    return newtokenSortTable;
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
    const tokenSortTable = grammar.getTokenSortTable();
    const newRules = grammar.getRules();
    const startSymbol = grammar.getStartSymbol();

    let eRulesNoMore = false;
    do
    {
      eRulesNoMore = true;

      for(const rule of newRules)
      {
        if(rule.isERule(tokenSortTable)) 
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

    return new Grammar(tokenSortTable, newRules, startSymbol);
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

    return Utils.generateAllNumbersAsArrayInBase(2, size).map(arr => arr.map(num => !!num));
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