import { Grammar } from "../Core/Grammar";
import { ParseTree } from "../Core/ParseTree";
import { TokenString } from "../Core/TokenString";
import { Utils } from "../Core/Utils";
import { TokenSort } from "../Core/TokenSortTable";
import { ParseTreeIterator } from "../Core/ParseTreeIterator";

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

export class NoLookaheadLLParser
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
  }

  public parse(inputString : TokenString) : Array<ParseTree>
  {
    const startSymbol = new TokenString([this.grammar.getStartSymbol()]);
    const tokenSortTable = this.grammar.getTokenSortTable();
    const runningThreads : Array<Thread> = [new Thread(startSymbol)];
    const acceptedThreads : Array<Thread> = [];
    for(let thread = runningThreads[0]; runningThreads.length !== 0; thread = runningThreads[0])
    {
      const currentLeftmostNonTerminal = thread.getLeftmostNonTerminal();
      const nonTerminalCorrespondingRule = this.grammar.queryRule(currentLeftmostNonTerminal);
      if(nonTerminalCorrespondingRule !== undefined)
      {
        for(const alternative of nonTerminalCorrespondingRule.getRhs())
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
              if(newThread.sententialForm.isEqual(inputString))
              {
                acceptedThreads.push(newThread);
              }
              break;
            }
            else if(newThread.matchIndex >= newThread.sententialForm.size())
            {
              break;
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

  // private runThread(thread : Thread) : void
  // {
    
  // }
  

  private readonly grammar : Grammar;
}