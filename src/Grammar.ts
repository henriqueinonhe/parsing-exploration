import { Token } from "./Token";
import { ProductionRule } from "./ProductionRule";
import { Utils } from "./Utils";

enum TokenSort
{
  NonTerminal,
  Terminal
}

interface TokenTable
{
  [tokenString : string] : TokenSort;
}

export class Grammar
{
  private static checkTokenAppearsInTerminalsAndNonTerminals(nonTerminals : Array<Token>, terminals : Array<Token>) : void
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
      throw new Error(`Tokens "${duplicatesStringList.join(`","`)}" appear both as terminals and non terminals!`);
    }
  }

  private static checkTokensInRulesAreInTokenTable(tokenTable : TokenTable, rules : Array<ProductionRule>) : void
  {
    const everyTokenInProductionRules = rules.reduce<Array<Token>>((tokenList, rule) => tokenList.concat(rule.everyTokenList()), []);

    const ruleTokenNotInTable = [] as Array<Token>;
    for(const ruleToken of everyTokenInProductionRules)
    {
      if(!tokenTable[ruleToken.toString()])
      {
        ruleTokenNotInTable.push(ruleToken);
      }
    }

    if(ruleTokenNotInTable.length !== 0)
    {
      const stringnizedTokensNotFound = ruleTokenNotInTable.map(token => token.toString());
      throw new Error(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "${stringnizedTokensNotFound.join(`", "`)}"`);
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
    if(!tokenTable[startSymbol.toString()])
    {
      throw new Error(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
    }
  }
  
  private static mergeRules(rules : Array<ProductionRule>) : Array<ProductionRule>
  {
    const mergedRules = [] as Array<ProductionRule>;
    for(const rule of rules)
    {
      for(const mergedRule of mergedRules)
      {
        if(rule.getLhs().isEqual(mergedRule.getLhs()))
        {
          
        }
      }
    }
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

    Grammar.checkTokenAppearsInTerminalsAndNonTerminals(nonTerminals, terminals);

    const tokenTable = Grammar.initializeTokenTable(nonTerminals, terminals);
    Grammar.checkTokensInRulesAreInTokenTable(tokenTable, rules);
    Grammar.checkStartSymbolIsInTable(tokenTable, startSymbol);
  }

  private readonly tokenTable : TokenTable;
  private readonly rules : Array<ProductionRule>;
  private readonly startSymbol : Token;
}
