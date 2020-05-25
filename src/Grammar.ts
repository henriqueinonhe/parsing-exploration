import { Token } from "./Token";
import { ProductionRule } from "./ProductionRule";
import { Utils } from "./Utils";
import { TokenTable, TokenSort } from "./TokenTable";
import { TokenString } from "./TokenString";

export enum GrammarType
{
  Type0,
  Type1,
  Type2,
  Type3
}

export class Grammar
{
  private static checkNonTerminalsAndTerminalsAreDisjunct(nonTerminals : Array<Token>, terminals : Array<Token>) : void
  {
    const duplicates = [];
    for(const nonTerminal of nonTerminals)
    {
      if(terminals.some(terminal => terminal.isEqual(nonTerminal)))
      {
        duplicates.push(nonTerminal);
      }
    }
    
    if(duplicates.length !== 0)
    {
      const duplicatesStringList = duplicates.map(elem => elem.toString());
      throw new Error(`Tokens "${duplicatesStringList.join(`", "`)}" appear both as terminals and non terminals!`);
    }
  }

  private static checkTokensInRulesAreInTokenTable(tokenTable : TokenTable, rules : Array<ProductionRule>) : void
  {
    const everyTokenInProductionRules = rules.reduce<Array<Token>>((tokenList, rule) => tokenList.concat(rule.everyTokenList()), []);

    const ruleTokenNotInTable = [] as Array<Token>;
    for(const ruleToken of everyTokenInProductionRules)
    {
      if(tokenTable[ruleToken.toString()] === undefined)
      {
        ruleTokenNotInTable.push(ruleToken);
      }
    }

    const ruleTokenNotInTableWithoutDuplicates = Utils.removeArrayDuplicates(ruleTokenNotInTable, (token1, token2) => token1.isEqual(token2));

    if(ruleTokenNotInTableWithoutDuplicates.length !== 0)
    {
      const stringnizedTokensNotFound = ruleTokenNotInTableWithoutDuplicates.map(token => token.toString());
      throw new Error(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "${stringnizedTokensNotFound.join(`", "`)}"!`);
    }
  }

  private static initializeTokenTable(nonTerminals : Array<Token>, terminals : Array<Token>) : TokenTable
  {
    const tokenTable  = {} as TokenTable;
    for(const nonTerminal of nonTerminals)
    {
      tokenTable[nonTerminal.toString()] = TokenSort.NonTerminal;
    }

    for(const terminal of terminals)
    {
      tokenTable[terminal.toString()] = TokenSort.Terminal;
    }

    return tokenTable;
  }

  private static checkStartSymbolIsInTable(tokenTable : TokenTable, startSymbol : Token) : void
  {
    if(tokenTable[startSymbol.toString()] === undefined)
    {
      throw new Error(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
    }
  }
  
  private static mergeRules(rules : Array<ProductionRule>) : Array<ProductionRule>
  {
    const mergedRules = [] as Array<ProductionRule>;
    loop:
    for(const rule of rules)
    {
      for(let index = 0; index < mergedRules.length; index++)
      {
        const mergedRule = mergedRules[index];
        if(rule.getLhs().isEqual(mergedRule.getLhs()))
        {
          mergedRules[index] = rule.mergeRule(mergedRule);
          continue loop; //In the mergedRules array there will be at most 1 rule with a given lhs at all times
        }
      }
      mergedRules.push(rule);
    }
    return mergedRules;
  }

  constructor(nonTerminals : Array<Token>, terminals : Array<Token>, rules : Array<ProductionRule>, startSymbol : Token)
  {
    if(nonTerminals.length === 0)
    {
      throw new Error("Non terminals list is empty!");
    }

    if(terminals.length === 0)
    {
      throw new Error("Terminals list is empty!");
    }

    Grammar.checkNonTerminalsAndTerminalsAreDisjunct(nonTerminals, terminals);
    const tokenTable = Grammar.initializeTokenTable(nonTerminals, terminals);
    Grammar.checkTokensInRulesAreInTokenTable(tokenTable, rules);
    Grammar.checkStartSymbolIsInTable(tokenTable, startSymbol);
    const mergedRules = Grammar.mergeRules(rules);

    this.tokenTable = tokenTable;
    this.rules = mergedRules;
    this.startSymbol = startSymbol;
  }

  public static constructFromStrings(nonTerminals : Array<string>, terminals : Array<string>, rules : Array<{lhs : string; rhs : Array<string>}>, startSymbol : string) : Grammar
  {
    const tokenizedNonTerminals = nonTerminals.map(string => new Token(string));
    const tokenizedTerminals = terminals.map(string => new Token(string));
    const tokenizedRules = rules.map(rule => ProductionRule.fromString(rule.lhs, rule.rhs));
    const tokenizedStartSymbol = new Token(startSymbol);

    return new Grammar(tokenizedNonTerminals, tokenizedTerminals, tokenizedRules, tokenizedStartSymbol);
  }

  public getTokenTable() : TokenTable
  {
    return this.tokenTable;
  }

  public getRules() : Array<ProductionRule>
  {
    return this.rules;
  }

  public getStartSymbol() : Token
  {
    return this.startSymbol;
  }

  public isRightRegular() : boolean
  {
    return this.rules.every(rule => rule.isRightRegular(this.tokenTable));
  }

  public isLeftRegular() : boolean
  {
    return this.rules.every(rule => rule.isLeftRegular(this.tokenTable));
  }

  public isContextFree() : boolean
  {
    return this.rules.every(rule => rule.isContextFree(this.tokenTable));
  }

  public isContextSensitive() : boolean
  {
    return this.rules.every(rule => rule.isContextSensitive(this.tokenTable));
  }

  public hasERules() : boolean
  {
    return this.rules.some(rule => rule.isERule(this.tokenTable));
  }

  public type() : GrammarType
  {
    if(this.isRightRegular() || this.isLeftRegular())
    {
      return GrammarType.Type3;
    }
    else if(this.isContextFree())
    {
      return GrammarType.Type2;
    }
    else if(this.isContextSensitive())
    {
      return GrammarType.Type1;
    }
    else
    {
      return GrammarType.Type0;
    }
  }

  public queryRule(lhs : TokenString) : ProductionRule | undefined
  {
    return this.rules.find(elem => elem.getLhs().isEqual(lhs));
  }

  private readonly tokenTable : TokenTable;
  private readonly rules : Array<ProductionRule>;
  private readonly startSymbol : Token;
}
