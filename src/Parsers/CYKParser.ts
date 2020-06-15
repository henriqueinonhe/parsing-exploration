import { Grammar } from "../Core/Grammar";
import { ParseTree } from "../Core/ParseTree";
import { CYKRecognizer } from "../Recognizers/CYKRecognizer";
import { TokenString } from "../Core/TokenString";
import { Token } from "../Core/Token";
import { TokenSort } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

class CYKTreeNode
{
  constructor(parent : CYKTreeNode | null, token : TokenString, matchedSubstringBeginIndex : number, matchedSubstringEndIndex : number, children : Array<CYKTreeNode> = [])
  {
    this.parent = parent;
    this.token = token;
    this.matchedSubstringBeginIndex = matchedSubstringBeginIndex;
    this.matchedSubstringEndIndex = matchedSubstringEndIndex;
    this.children = children;
  }

  public appendChild(token : TokenString, matchedSubstringBeginIndex : number, matchedSubstringEndIndex : number) : void
  {
    this.children.push(new CYKTreeNode(this, token, matchedSubstringBeginIndex, matchedSubstringEndIndex));
  }

  public clone(parent : CYKTreeNode | null) : CYKTreeNode
  {
    const clonedChildren = this.children.map(child => child.clone(this));
    return new CYKTreeNode(parent, this.token, this.matchedSubstringBeginIndex, this.matchedSubstringEndIndex, clonedChildren);
  }

  public parent : CYKTreeNode | null;
  public token : TokenString;
  public matchedSubstringBeginIndex : number;
  public matchedSubstringEndIndex : number;
  public children : Array<CYKTreeNode>;
}

class CYKTree
{
  constructor(token : TokenString, matchedSubstringBeginIndex : number, matchedSubstringEndIndex : number)
  {
    this.root = new CYKTreeNode(null, token, matchedSubstringBeginIndex, matchedSubstringEndIndex, []);
    this.stack = [];
  }

  public clone() : CYKTree
  {
    const newTree = new CYKTree(this.root.token, this.root.matchedSubstringBeginIndex, this.root.matchedSubstringEndIndex);
    newTree.root = this.root.clone(null);
    newTree.stack = this.stack.slice();

    return newTree;
  }

  public currentNode() : CYKTreeNode
  {
    let currentNode = this.root;
    for(const index of this.stack)
    {
      currentNode = currentNode.children[index];
    }
    return currentNode;
  }

  public root : CYKTreeNode;
  public stack : Array<number>;
}

//Parser Itself
export class CYKParser extends CYKRecognizer
{
  constructor(grammar : Grammar)
  {
    super(grammar);
  }

  public parse(inputString : TokenString) : void
  {
    const tokenSortTable = this.grammar.getTokenSortTable();
    const cykTable = this.buildTable(inputString);
    const startSymbol = this.grammar.getStartSymbol();
    const inputStringAccepted = cykTable[inputString.size()][0].has(startSymbol.toString());
    if(!inputStringAccepted)
    {
      throw new Error("Input string is not in the language!");
    }

    const parseTreeQueue : Array<CYKTree> = [new CYKTree(new TokenString([startSymbol]), 0, inputString.size())];
    const finishedTreeList : Array<CYKTree> = [];
    while(parseTreeQueue.length !== 0)
    {
      const currentTree = parseTreeQueue[0];
      let currentNode = currentTree.currentNode();
      let currentToken = currentNode.token;
      if(tokenSortTable[currentToken.toString()] === TokenSort.Terminal ||
         currentToken.isEmpty())
      {
        const currentStack = currentTree. stack;
        const stackLastIndex = currentStack.length - 1;
        const stackLastElement = currentStack[stackLastIndex];
        while(currentTree.currentNode() !== null && 
              stackLastElement === currentTree.currentNode().parent?.children.length as number - 1) //FIXME!
        {
          currentTree.stack.pop();
        }

        if(currentTree.stack.length === 0)
        {
          finishedTreeList.push(currentTree);
          parseTreeQueue.shift();
          continue;
        }
        else
        {
          currentTree.stack[currentTree.stack.length - 1]++;
        }
      }

      currentNode = currentTree.currentNode();
      currentToken = currentNode.token;
      const nonTerminalCorrespondingRule = this.grammar.queryRule(currentToken);
      if(nonTerminalCorrespondingRule === undefined)
      {
        //Remove from queue
        parseTreeQueue.shift();
      }
      else
      {
        const currentlyMatchedSubstringBeginIndex = currentNode.matchedSubstringBeginIndex;
        const currentlyMatchedSubstringEndIndex = currentNode.matchedSubstringEndIndex;
        const currentlyMatchedSubstring = inputString.slice(currentlyMatchedSubstringBeginIndex, currentlyMatchedSubstringEndIndex);
        const alternatives = nonTerminalCorrespondingRule.getRhs();
        for(const alternative of alternatives)
        {
          //Check for empty alternatives
          if(alternative.isEmpty())
          {
            if(currentlyMatchedSubstring.isEmpty())
            {
              const newTree = currentTree.clone();
              newTree.currentNode().appendChild(currentlyMatchedSubstring, currentlyMatchedSubstringBeginIndex, currentlyMatchedSubstringEndIndex);
              newTree.stack.push(0);
              parseTreeQueue.push(newTree);
            }
            else
            {
              continue;
            }
          }

          const partitions = Utils.listPartitions(currentlyMatchedSubstring.getTokenList(), alternative.size(), true);

          for(const partition of partitions)
          {
            const groupStartIndexList = this.generatePartitionGroupsStartIndexListInRespectToInputString(currentlyMatchedSubstringBeginIndex, partition);
            if(this.alternativeAdheresToPartition(alternative, partition, cykTable, groupStartIndexList))
            {
              const newTree = currentTree.clone();
              partition.forEach((group, index) => 
              {
                const currentToken = alternative.slice(index, index + 1);
                const beginIndex = groupStartIndexList[index];
                const endIndex = beginIndex + group.length;
                newTree.currentNode().appendChild(currentToken, beginIndex, endIndex);
              });
              newTree.stack.push(0);
              parseTreeQueue.push(newTree);
            }
          }
        }
        parseTreeQueue.shift();

      }
    }
    
    return;
    //Convert to parse trees?

  }

}

