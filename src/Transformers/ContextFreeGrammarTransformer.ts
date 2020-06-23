import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { ProductionRule } from "../Core/ProductionRule";
import { Token } from "../Core/Token";
import { ContextFreeGrammarAnalyzer } from "../Analyzers/ContextFreeGrammarAnalyzer";
import { TokenSortTable, TokenSort } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

export class ContextFreeGrammarTransformer
{
  /**
   * Removes all unit rules from a given context
   * free grammar, preserving weak equivalence. 
   * As a side effect also removes
   * direct loop alternatives from rules.
   * 
   * @param grammar 
   */
  public static removeUnitRules(grammar : Grammar) : Grammar
  {
    let rules = grammar.getRules();
    const tokenSortTable = grammar.getTokenSortTable();

    let stillHasUnitRules = true;
    while(stillHasUnitRules)
    {
      stillHasUnitRules = false;
      const rulesWithoutDirectLoops = ContextFreeGrammarTransformer.removeDirectLoopsAlternatives(rules);
  
      const rulesWithoutUnitRules = [];
      for(const rule of rulesWithoutDirectLoops)
      {
        const newAlternatives = [];
        for(const alternative of rule.getRhs())
        {
          const isUnitAlternative = alternative.size() === 1 && 
                                    tokenSortTable[alternative.toString()] === TokenSort.NonTerminal;
          if(isUnitAlternative)
          {
            const nonTerminalAssociatedRule = rulesWithoutDirectLoops.find(rule => rule.getLhs().isEqual(alternative));
            if(nonTerminalAssociatedRule !== undefined)
            {
              stillHasUnitRules = true;
              newAlternatives.push(... this.generateNonTerminalSubstitutionAlternatives(nonTerminalAssociatedRule, alternative));
            }
          }
          else
          {
            newAlternatives.push(alternative);
          }
        }
        rulesWithoutUnitRules.push(new ProductionRule(rule.getLhs(), newAlternatives));
      }
      rules = rulesWithoutUnitRules;
    }

    return new Grammar(tokenSortTable, rules, grammar.getStartSymbol());
  }


  /**
   * Returns a new array of rules with all direct loop 
   * alternatives removed.
   * 
   * @param rules 
   */
  public static removeDirectLoopsAlternatives(rules : Array<ProductionRule>) : Array<ProductionRule> 
  {
    const rulesWithoutDirectLoops = [];
    for (const rule of rules) 
    {
      const newAlternatives = [];
      for (const alternative of rule.getRhs()) 
      {
        const isDirectLoopAlternative = rule.getLhs().isEqual(alternative);
        if (!isDirectLoopAlternative) 
        {
          newAlternatives.push(alternative);
        }
      }
      rulesWithoutDirectLoops.push(new ProductionRule(rule.getLhs(), newAlternatives));
    }
    return rulesWithoutDirectLoops;
  }

  public static substituteNonTerminalIntoRule(nonTerminalAssociatedRule : ProductionRule, ruleToBeSubstitutedInto : ProductionRule) : ProductionRule
  {
    const newRhs = [];
    for(const alternative of ruleToBeSubstitutedInto.getRhs())
    {
      newRhs.push(... this.generateNonTerminalSubstitutionAlternatives(nonTerminalAssociatedRule, alternative));
    }

    return new ProductionRule(ruleToBeSubstitutedInto.getLhs(), newRhs);
  }

  /**
   * Generates all possible alternatives where
   * every occurence of a given non terminal
   * is expanded into its associated rule alternatives.
   * 
   * @param nonTerminalAssociatedRule 
   * @param alternative 
   */
  public static generateNonTerminalSubstitutionAlternatives(nonTerminalAssociatedRule : ProductionRule, alternative : TokenString) : Array<TokenString>
  {
    //Count non terminal occurrences within alternative
    const nonTerminal = nonTerminalAssociatedRule.getLhs().tokenAt(0);
    const nonTerminalOccurrencesWithinAlternative = alternative.reduce((accum, token) => token.isEqual(nonTerminal) ? accum + 1 : accum, 0);

    const nonTerminalsAssociatedRuleAlternatives = nonTerminalAssociatedRule.getRhs();
    const alternativeChoiceIndexesList = Utils.generateAllNumbersAsArrayInBase(nonTerminalsAssociatedRuleAlternatives.length, nonTerminalOccurrencesWithinAlternative);
    const generatedAlternatives = [];

    for(const alternativeChoiceIndexes of alternativeChoiceIndexesList)
    {
      const substitutedAlternativeTokenList : Array<Token> = [];
      let nonTerminalOccurrenceCount = 0;
      for(const token of alternative.getTokenList())
      {
        if(token.isEqual(nonTerminal))
        {
          const alternativeToInsert = nonTerminalsAssociatedRuleAlternatives[alternativeChoiceIndexes[nonTerminalOccurrenceCount]];
          substitutedAlternativeTokenList.push(...alternativeToInsert.getTokenList());
          nonTerminalOccurrenceCount++;
        }
        else
        {
          substitutedAlternativeTokenList.push(token);
        }
      }
      generatedAlternatives.push(new TokenString(substitutedAlternativeTokenList));
    }

    return generatedAlternatives;
  }

  /**
   * Returns a new grammar with non productive alternatives, 
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
    const cleanAlternativesRules = rules.map(rule => this.removeUselessAlternatives(rule, uselessTokens)).filter(rule => rule !== undefined);

    for(const rule of cleanAlternativesRules)
    {
      if(!uselessTokens.includes((rule as ProductionRule).getLhs().toString()))
      {
        newRules.push((rule as ProductionRule));
      }
    }
    return newRules;
  }

  private static removeUselessAlternatives(rule : ProductionRule, uselessTokens : Array<string>) : ProductionRule | undefined
  {
    const newRhs = [];
    for(const alternative of rule.getRhs())
    {
      if(alternative.every(token => !uselessTokens.includes(token.toString())))
      {
        newRhs.push(alternative);
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
      const newAlternatives = [];

      for(const alternative of rule.getRhs())
      {
        if(alternative.includes(eRuleLhs)) 
        {
          newAlternatives.push(...ContextFreeGrammarTransformer.generateERuleSubstitutionAlternatives(eRuleLhs, alternative));
        }
      }
      const newRhs = [...rule.getRhs()];
      newRhs.push(...newAlternatives);
      const newRhsWithoutDuplicates = Utils.removeArrayDuplicates(newRhs, (alternative1, alternative2) => alternative1.isEqual(alternative2));
      rule.setRhs(newRhsWithoutDuplicates);
    }
  }

  private static generateERuleSubstitutionAlternatives(eRuleLhs : TokenString, alternative : TokenString) : Array<TokenString>
  {
    const newAlternatives = [];
    const eRuleLhsNonTerminal = eRuleLhs.tokenAt(0);
    const eRuleLhsNonTerminalOccurrenceCount = alternative.reduce((count, token) => token.isEqual(eRuleLhsNonTerminal) ? count + 1 : count, 0);
    const eRuleLhsNonTerminalIndicatorList = ContextFreeGrammarTransformer.generateIndicatorList(eRuleLhsNonTerminalOccurrenceCount);

    for(const indicator of eRuleLhsNonTerminalIndicatorList)
    {
      const newAlternative = ContextFreeGrammarTransformer.generateNonUnitRuleAlternativeTokenString(eRuleLhsNonTerminal, alternative, indicator);
      newAlternatives.push(newAlternative);
    }
    return newAlternatives;
  }

  private static generateIndicatorList(size : number) : Array<Array<boolean>>
  {
    if(size <= 0)
    {
      throw new Error("Indicator list size must be > 0!");
    }

    return Utils.generateAllNumbersAsArrayInBase(2, size).map(arr => arr.map(num => !!num));
  }

  private static generateNonUnitRuleAlternativeTokenString(eRuleLhsNonTerminal : Token, alternative : TokenString, indicator : Array<boolean>) : TokenString
  {
    const tokenList = [];
    let indicatorIndex = 0;
    for(let index = 0; index < alternative.size(); index++)
    {
      const currentToken = alternative.tokenAt(index);
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