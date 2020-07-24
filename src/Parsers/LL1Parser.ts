import { Grammar } from "../Core/Grammar";
import { ParseTree } from "../Core/ParseTree";
import { TokenString } from "../Core/TokenString";
import { TokenSort } from "../Core/TokenSortTable";
import { Token } from "../Core/Token";
import { ProductionRuleParser } from "../Core/ProductionRule";

export class LL1Parser
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
    this.tokensThatDeriveEmptyStringSet = LL1Parser.computeTokensThatDeriveEmptyStringSet(grammar);
    this.firstSets = LL1Parser.computeFirstSets(grammar, this.tokensThatDeriveEmptyStringSet);
    this.followSets = LL1Parser.computeFollowSets(grammar, this.tokensThatDeriveEmptyStringSet, this.firstSets);
    this.parseTable = LL1Parser.computeParseTable(grammar, this.tokensThatDeriveEmptyStringSet, this.firstSets, this.followSets);
  }

  private static initializeFirstSets(grammar : Grammar) : TokenSetTable
  {
    const firstSets : TokenSetTable = {};
    const tokenSortTable = grammar.getTokenSortTable();
    for(const token in tokenSortTable)
    {
      if(tokenSortTable[token] === TokenSort.Terminal)
      {
        firstSets[token] = new Set<string>([token]);
      }
      else
      {
        firstSets[token] = new Set<string>();
      }
    }
    return firstSets;
  }

  private static computeFirstSets(grammar : Grammar, tokensThatDeriveEmptyStringSet : Set<string>) : TokenSetTable
  {
    const firstSets = this.initializeFirstSets(grammar);
    let hasNewInformation = true;
    while(hasNewInformation)
    {
      hasNewInformation = false;
      for(const rule of grammar.getRules())
      {
        const nonTerminal = rule.getLhs();
  
        for(const alternative of rule.getRhs())
        {
          for(const alternativeToken of alternative.getTokenList())
          {
            for(const element of firstSets[alternativeToken.toString()])
            {
              if(!firstSets[nonTerminal.toString()].has(alternativeToken.toString()))
              {
                firstSets[nonTerminal.toString()].add(element);
                hasNewInformation = true;
              }
            }

            if(!tokensThatDeriveEmptyStringSet.has(alternativeToken.toString()))
            {
              break;
            }
          }
        }
      }
    }

    return firstSets;
  }

  private static computeTokensThatDeriveEmptyStringSet(grammar : Grammar) : Set<string>
  {
    const tokensThatDeriveEmptyStringSet = new Set<string>();
    let hasNewInformation = true;
    while(hasNewInformation)
    {
      hasNewInformation = false;
      for(const rule of grammar.getRules())
      {
        const nonTerminal = rule.getLhs();
        if(tokensThatDeriveEmptyStringSet.has(nonTerminal.toString()))
        {
          continue;
        }

        for(const alternative of rule.getRhs())
        {
          if(alternative.isEmpty() || alternative.every(token => tokensThatDeriveEmptyStringSet.has(token.toString())))
          {
            tokensThatDeriveEmptyStringSet.add(nonTerminal.toString());
            hasNewInformation = true;
            break;
          }
        }
      }
    }

    return tokensThatDeriveEmptyStringSet;
  }

  private static initializeFollowSets(grammar : Grammar) : TokenSetTable
  {
    const followSets : TokenSetTable = {};
    const nonTerminals = grammar.listNonTerminals();
    for(const nonTerminal of nonTerminals)
    {
      followSets[nonTerminal.toString()] = new Set<string>();
    }
    return followSets;
  }

  private static computeFollowSets(grammar : Grammar, tokensThatDeriveEmptyStringSet : Set<string>, firstSets : TokenSetTable) : TokenSetTable
  {
    const followSets = this.initializeFollowSets(grammar);
    const tokenSortTable = grammar.getTokenSortTable();
    let hasNewInformation = true;
    while(hasNewInformation)
    {
      hasNewInformation = false;
      for(const rule of grammar.getRules())
      {
        for(const alternative of rule.getRhs())
        {
          for(let tokenUnderAnalysisIndex = 0; tokenUnderAnalysisIndex < alternative.size(); tokenUnderAnalysisIndex++)
          {
            const currentTokenUnderAnalysis = alternative.getTokenList()[tokenUnderAnalysisIndex].toString();
            if(tokenSortTable[currentTokenUnderAnalysis] === TokenSort.NonTerminal)
            {
              for(let followTokenIndex = tokenUnderAnalysisIndex + 1; followTokenIndex < alternative.size(); followTokenIndex++)
              {
                const currentFollowToken = alternative.getTokenList()[followTokenIndex].toString();
                const currentFollowTokenFirstSet = firstSets[currentFollowToken];
                for(const element of currentFollowTokenFirstSet)
                {
                  if(!followSets[currentTokenUnderAnalysis].has(element))
                  {
                    followSets[currentTokenUnderAnalysis].add(element);
                    hasNewInformation = true;
                  }
                }

                if(!tokensThatDeriveEmptyStringSet.has(currentFollowToken))
                {
                  break;
                }

                //The string following currentTokenUnderAnalisys is transparent
                if(followTokenIndex === alternative.size() - 1)
                {
                  const currentRuleLhsNonTerminal = rule.getLhs().toString();
                  for(const element of followSets[currentRuleLhsNonTerminal])
                  {
                    if(!followSets[currentTokenUnderAnalysis].has(element))
                    {
                      followSets[currentTokenUnderAnalysis].add(element);
                      hasNewInformation = true;
                    }
                  }
                }
              }
            }
          }
        }
      }      
    }

    return followSets;
  }

  private static initializeParseTable(grammar : Grammar) : ParseTable
  {
    const parseTable : ParseTable = {};
    const nonTerminals = grammar.listNonTerminals().map(token => token.toString());
    const terminals = grammar.listTerminals().map(token => token.toString());
    for(const nonTerminal of nonTerminals)
    {
      parseTable[nonTerminal] = {};
      for(const terminal of terminals)
      {
        parseTable[nonTerminal][terminal] = [];
      }
    }

    return parseTable;
  }
 
  private static computeParseTable(grammar : Grammar, tokensThatDeriveEmptyStringSet : Set<string>, firstSets : TokenSetTable, followSets : TokenSetTable) : ParseTable
  {
    const parseTable = this.initializeParseTable(grammar);
    for(const rule of grammar.getRules())
    {
      const nonTerminal = rule.getLhs().toString();
      for(const alternative of rule.getRhs())
      {
        const alternativeFirstSet = this.computeTokenStringFirstSet(alternative, tokensThatDeriveEmptyStringSet, firstSets);
        for(const terminal of alternativeFirstSet)
        {
          parseTable[nonTerminal][terminal].push(alternative);
        }
      }

      if(tokensThatDeriveEmptyStringSet.has(nonTerminal))
      {
        for(const terminal of followSets[nonTerminal])
        {
          const emptyString = new TokenString([]);
          parseTable[nonTerminal][terminal].push(emptyString);
        }
      }
    }

    return parseTable;
  }

  private static computeTokenStringFirstSet(tokenString : TokenString, tokensThatDeriveEmptyStringSet : Set<string>, firstSets : TokenSetTable) : Set<string>
  {
    const firstSet = new Set<string>();
    for(const token of tokenString.getTokenList())
    {
      for(const element of firstSets[token.toString()])
      {
        firstSet.add(element);
      }

      if(!tokensThatDeriveEmptyStringSet.has(token.toString()))
      {
        break;
      }
    }

    return firstSet;
  }

  // public parse(inputString : TokenString) : ParseTree
  // {

  // }

  private grammar : Grammar;
  private tokensThatDeriveEmptyStringSet : Set<string>;
  private firstSets : TokenSetTable;
  private followSets : TokenSetTable;
  private parseTable : ParseTable;
}

interface TokenSetTable
{
  [token : string] : Set<string>;
}

type Alternatives = Array<TokenString>;
interface ParseTable
{
  [nonTerminal : string] : {[terminal : string] : Alternatives};
}