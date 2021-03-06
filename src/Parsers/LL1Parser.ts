import { Grammar } from "../Core/Grammar";
import { ParseTree } from "../Core/ParseTree";
import { TokenString } from "../Core/TokenString";
import { TokenSort } from "../Core/TokenSortTable";

import { ParseTreeIterator } from "../Core/ParseTreeIterator";
import { Utils } from "../Core/Utils";

class Thread
{
  constructor(sententialForm : TokenString)
  {
    this.sententialForm = sententialForm;
    this.matchIndex = 0;
    this.nonTerminalsSubstitutions = [];
  }

  public getLeftmostNonTerminal() : TokenString
  {
    if(this.matchIndex >= this.sententialForm.size())
    {
      throw new Error("There are no non terminals left in the sentential form!");
    }

    return this.sententialForm.slice(this.matchIndex, this.matchIndex + 1);
  }

  public clone() : Thread
  {
    const newThread = new Thread(this.sententialForm.clone());
    newThread.matchIndex = this.matchIndex;
    newThread.nonTerminalsSubstitutions = Utils.cloneArray(this.nonTerminalsSubstitutions);
    return newThread;
  }

  public sententialForm : TokenString;
  public matchIndex : number;
  public nonTerminalsSubstitutions : Array<TokenString>;
}

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
              if(!firstSets[nonTerminal.toString()].has(element))
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
    //End Marker
    const startSymbol = grammar.getStartSymbol();
    followSets[startSymbol.toString()].add(`"END_MARKER"`);

    const startSymbolCorrespondingRule = grammar.queryRule(new TokenString([startSymbol]));
    if(startSymbolCorrespondingRule === undefined)
    {
      return followSets;
    }
    else
    {
      for(const alternative of startSymbolCorrespondingRule.getRhs())
      {
        if(!alternative.isEmpty())
        {
          const lastToken = alternative.tokenAt(alternative.size() - 1).toString();
          if(tokenSortTable[lastToken] === TokenSort.NonTerminal)
          {
            followSets[lastToken].add(`"END_MARKER"`);
          }
        }
      }
    }


    //Rest
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
      parseTable[nonTerminal][`"END_MARKER"`] = [];
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
        if(alternative.isEmpty() || alternative.every(token => tokensThatDeriveEmptyStringSet.has(token.toString())))
        {
          for(const terminal of followSets[nonTerminal])
          {
            parseTable[nonTerminal][terminal].push(alternative);
          }
        }

        const alternativeFirstSet = this.computeTokenStringFirstSet(alternative, tokensThatDeriveEmptyStringSet, firstSets);
        for(const terminal of alternativeFirstSet)
        {
          parseTable[nonTerminal][terminal].push(alternative);
        }
      }
    }

    //Remove duplicates from parse table
    const parseTableWithoutDuplicates : ParseTable = {};
    for(const nonTerminal in parseTable)
    {
      parseTableWithoutDuplicates[nonTerminal] = {};
      for(const terminal in parseTable[nonTerminal])
      {
        parseTableWithoutDuplicates[nonTerminal][terminal] = Utils.removeArrayDuplicates(parseTable[nonTerminal][terminal], (e1, e2) => e1.isEqual(e2));
      }
    }

    return parseTableWithoutDuplicates;
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

  public parse(inputString : TokenString) : Array<ParseTree>
  {
    const startSymbol = new TokenString([this.grammar.getStartSymbol()]);
    const tokenSortTable = this.grammar.getTokenSortTable();
    const runningThreads : Array<Thread> = [new Thread(startSymbol)];
    const acceptedThreads : Array<Thread> = [];
    for(let thread = runningThreads[0]; runningThreads.length !== 0; thread = runningThreads[0])
    {
      const leftmostNonTerminal = thread.getLeftmostNonTerminal().toString();
      const lookaheadToken = thread.matchIndex !== inputString.size() ? inputString.tokenAt(thread.matchIndex).toString() : `"END_MARKER"`;
      for(const alternative of this.parseTable[leftmostNonTerminal][lookaheadToken])
      {
        //Derive/Predict
        const newThread = thread.clone();
        const leftmostNonTerminalIndex = newThread.matchIndex;
        newThread.sententialForm.splice(leftmostNonTerminalIndex, 1, ...alternative.getTokenList());
        newThread.nonTerminalsSubstitutions.push(alternative);

        //Match
        while(true)
        {
          if(newThread.matchIndex === inputString.size())
          {
            if(newThread.matchIndex >= newThread.sententialForm.size())
            {
              if(newThread.sententialForm.isEqual(inputString))
              {
                acceptedThreads.push(newThread);
              }
              break;
            }
            else
            {
              runningThreads.push(newThread);
            }
          }
          else
          {
            const threadCurrentMatchingToken = newThread.sententialForm.tokenAt(newThread.matchIndex);
            const inputStringCurrentMatchingToken = inputString.tokenAt(newThread.matchIndex);
            if(tokenSortTable[threadCurrentMatchingToken.toString()] === TokenSort.NonTerminal)
            {
              runningThreads.push(newThread);
              break;
            }
            else if(tokenSortTable[threadCurrentMatchingToken.toString()] === TokenSort.Terminal && threadCurrentMatchingToken.isEqual(inputStringCurrentMatchingToken))
            {
              newThread.matchIndex++;
            }
            else if(tokenSortTable[threadCurrentMatchingToken.toString()] === TokenSort.Terminal && !threadCurrentMatchingToken.isEqual(inputStringCurrentMatchingToken))
            {
              break;
            }
            else
            {
              throw new Error("Shouldn't be here!");
            }
          }
        }
      }
      runningThreads.shift();
    }
    

    //Convert threads to parsing trees
    const parseTrees : Array<ParseTree> = [];
    for(const thread of acceptedThreads)
    {
      const parseTree = new ParseTree(this.grammar.getStartSymbol());
      const iter = new ParseTreeIterator(parseTree);
      const stack : Array<number> = [];
      for(const substitution of thread.nonTerminalsSubstitutions)
      {
        let substitutionDone = false;
        while(!substitutionDone)
        {
          const currentNode = iter.getCurrentNode();
          if(tokenSortTable[currentNode.getToken().toString()] === TokenSort.NonTerminal)
          {
            for(const token of substitution.getTokenList())
            {
              currentNode.appendChild(token);
            }
            substitutionDone = true;
          }
  
          if(currentNode.isLeaf())
          {
            iter.goToParent();
            let stackTop = stack[stack.length - 1];
            while(stackTop + 1 >= iter.getCurrentNode().getChildren().length)
            {
              stack.pop();
              stackTop = stack[stack.length - 1];
              iter.goToParent();
            }
            stack[stack.length - 1]++;
            iter.goToNthChild(stack[stack.length - 1]);
          }
          else
          {
            stack.push(0);
            iter.goToNthChild(0);
          }
        }
      }
      parseTrees.push(parseTree);
    }

    return parseTrees;
  }

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