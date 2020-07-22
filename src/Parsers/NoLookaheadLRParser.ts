import { Grammar } from "../Core/Grammar";
import { TokenString } from "../Core/TokenString";
import { ParseTree } from "../Core/ParseTree";
import { Utils } from "../Core/Utils";
import { Token } from "../Core/Token";

class Thread
{
  constructor(unreadTokens : Array<Token>, shiftedTokens : Array<ParseTree>)
  {
    this.unreadTokens = Utils.cloneArray(unreadTokens);
    this.shiftedTokens = Utils.cloneArray(shiftedTokens);
  }

  public shift() : void
  {
    this.shiftedTokens.push(new ParseTree(this.unreadTokens.shift() as Token));
  }

  public clone() : Thread
  {
    return new Thread(this.unreadTokens, this.shiftedTokens);
  }

  public getShiftedTokenString() : TokenString
  {
    return new TokenString(this.shiftedTokens.map(tree => tree.getRoot().getToken()));
  }

  public isShiftable() : boolean
  {
    return this.unreadTokens.length !== 0;
  }

  public reduce(alternative : TokenString, nonTerminal : Token) : void
  {
    const reducedTokensTree = new ParseTree(nonTerminal);
    const tokensToBeReduced = this.shiftedTokens.slice(this.shiftedTokens.length - alternative.size());
    const tokensToBeReducedNodeQueue = tokensToBeReduced.map(tree => tree.getRoot());
    for(const node of tokensToBeReducedNodeQueue)
    {
      reducedTokensTree.getRoot().appendChild(node.getToken());
    }

    const reducedTokensNodeQueue = reducedTokensTree.getRoot().getChildren().slice();
    while(tokensToBeReducedNodeQueue.length !== 0)
    {
      const currentOldNode = tokensToBeReducedNodeQueue[0];
      const currentNewNode = reducedTokensNodeQueue[0];
      for(const child of currentOldNode.getChildren())
      {
        currentNewNode.appendChild(child.getToken());
        tokensToBeReducedNodeQueue.push(child);
      }
      for(const child of currentNewNode.getChildren())
      {
        reducedTokensNodeQueue.push(child);
      }
      tokensToBeReducedNodeQueue.shift();
      reducedTokensNodeQueue.shift();
    }
    const untouchedTokens = this.shiftedTokens.slice(0, this.shiftedTokens.length - alternative.size());
    this.shiftedTokens = [...untouchedTokens, reducedTokensTree];
  }

  public getShiftedTokens() : Array<ParseTree>
  {
    return this.shiftedTokens;
  }

  private unreadTokens : Array<Token>;
  private shiftedTokens : Array<ParseTree>;
}

export class NoLookaheadLRParser
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
    if(!grammar.isContextFree())
    {
      throw new Error("This parser only works for context free grammars!");
    }
  }

  public parse(inputString : TokenString) : Array<ParseTree>
  {
    const firstThread = new Thread(inputString.getTokenList(), []);
    const runningThreads = [firstThread];
    const acceptedThreads : Array<Thread> = [];
    while(runningThreads.length !== 0)
    {
      const currentThread = runningThreads[0];
      if(currentThread.isShiftable())
      {
        currentThread.shift();
      }
      
      //Find possible reductions
      const newThreads : Array<Thread> = currentThread.isShiftable() ? [currentThread] : [];
      const shiftedTokenString = currentThread.getShiftedTokenString();
      for(const rule of this.grammar.getRules())
      {
        for(const alternative of rule.getRhs())
        {
          if(shiftedTokenString.endsWith(alternative))
          {
            const newThread = currentThread.clone();
            const currentRuleNonTerminal = rule.getLhs().tokenAt(0);
            newThread.reduce(alternative, currentRuleNonTerminal);
            newThreads.push(newThread);
          }
        }
      }

      //Filter threads
      const startSymbol = this.grammar.getStartSymbol();
      for(const thread of newThreads)
      {
        const threadIsAccepted = thread.getShiftedTokenString().toString() === startSymbol.toString() && !thread.isShiftable();
        if(threadIsAccepted)
        {
          acceptedThreads.push(thread);
        }
        else
        {
          runningThreads.push(thread);
        }
      }

      runningThreads.shift();
    }

    const treeArray = acceptedThreads.map(thread => thread.getShiftedTokens()[0]);
    return treeArray;
  }


  private grammar : Grammar;
}