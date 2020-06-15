import { Grammar } from "../Core/Grammar";
import { ParseTree } from "../Core/ParseTree";
import { CYKRecognizer } from "../Recognizers/CYKRecognizer";
import { TokenString } from "../Core/TokenString";
import { Token } from "../Core/Token";
import { TokenSort } from "../Core/TokenSortTable";
import { Utils } from "../Core/Utils";

class CYKTreeNode
{
  constructor(parent : CYKTreeNode | null, token : Token, matchedSubstringBeginIndex : number, matchedSubstringEndIndex : number, children : Array<CYKTreeNode> = [])
  {
    this.parent = parent;
    this.token = token;
    this.matchedSubstringBeginIndex = matchedSubstringBeginIndex;
    this.matchedSubstringEndIndex = matchedSubstringEndIndex;
    this.children = children;
  }

  public appendChild(token : Token, matchedSubstringBeginIndex : number, matchedSubstringEndIndex : number) : void
  {
    this.children.push(new CYKTreeNode(this, token, matchedSubstringBeginIndex, matchedSubstringEndIndex));
  }

  public clone(parent : CYKTreeNode | null) : CYKTreeNode
  {
    const clonedChildren = this.children.map(child => child.clone(this));
    return new CYKTreeNode(parent, this.token, this.matchedSubstringBeginIndex, this.matchedSubstringEndIndex, clonedChildren);
  }

  public parent : CYKTreeNode | null;
  public token : Token;
  public matchedSubstringBeginIndex : number;
  public matchedSubstringEndIndex : number;
  public children : Array<CYKTreeNode>;
}

class CYKTree
{
  constructor(token : Token, matchedSubstringBeginIndex : number, matchedSubstringEndIndex : number)
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

  public root : CYKTreeNode;
  public stack : Array<number>;
}

class CYKTreeIterator
{
  constructor(tree : CYKTree)
  {
    this.tree = tree;
    this.currentNode = tree.root;
    this.travelPath(tree.stack);
  }

  public goToParent() : CYKTreeIterator
  {
    if(this.currentNode.parent === null)
    {
      throw new Error("Current node is already root!");
    }

    this.currentNode = this.currentNode.parent;
    return this;
  }

  public goToChild(index : number) : CYKTreeIterator
  {
    if(index >= this.currentNode.children.length)
    {
      throw new Error("Child index out of bounds!");
    }

    this.currentNode = this.currentNode.children[index];
    return this;
  }

  public goToRoot() : CYKTreeIterator
  {
    this.currentNode = this.tree.root;
    return this;
  }

  public travelPath(path : Array<number>) : CYKTreeIterator
  {
    for(const index of path)
    {
      this.goToChild(index);
    }
    return this;
  }

  public node() : CYKTreeNode
  {
    return this.currentNode;
  }

  public tree : CYKTree;
  public currentNode : CYKTreeNode;
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

    const parseTreeQueue : Array<CYKTree> = [new CYKTree(startSymbol, 0, inputString.size())];
    const finishedTreeList : Array<CYKTree> = [];
    while(parseTreeQueue.length !== 0)
    {
      const currentTree = parseTreeQueue[0];
      const iter = new CYKTreeIterator(currentTree);
      const currentNode = iter.node();
      const currentToken = currentNode.token;

      if(tokenSortTable[currentToken.toString()] === TokenSort.Terminal)
      {

        //Encapsulate into another function
        while(currentTree.stack[currentTree.stack.length - 1] === iter.node().children.length - 1)
        {
          currentTree.stack.pop();
        }
        if(currentTree.stack === [])
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

      const nonTerminalCorrespondingRule = this.grammar.queryRule(new TokenString([currentToken]));
      if(nonTerminalCorrespondingRule === undefined)
      {
        //Remove from queue
        parseTreeQueue.shift();
      }
      else
      {
        const currentlyMatchedSubstringBeginIndex = currentNode.matchedSubstringBeginIndex;
        const currentlyMatchedSubstringEndIndex = currentNode.matchedSubstringEndIndex;
        const alternatives = nonTerminalCorrespondingRule.getRhs();
        for(const alternative of alternatives)
        {
          const currentlyMatchedSubstring = inputString.slice(currentlyMatchedSubstringBeginIndex, currentlyMatchedSubstringEndIndex);
          const partitions = Utils.listPartitions(currentlyMatchedSubstring.getTokenList(), alternative.size(), true);

          for(const partition of partitions)
          {
            const groupStartIndexList = this.generatePartitionGroupsStartIndexListInRespectToInputString(currentlyMatchedSubstringBeginIndex, partition);
            if(this.alternativeAdheresToPartition(alternative, partition, cykTable, groupStartIndexList))
            {
              const newTree = currentTree.clone();
              const newIter = new CYKTreeIterator(newTree);
              newTree.stack.push(0);
              partition.forEach((group, index) => 
              {
                const currentToken = inputString.tokenAt(currentlyMatchedSubstringBeginIndex + index);
                const beginIndex = groupStartIndexList[index];
                const endIndex = beginIndex + group.length;
                newIter.node().appendChild(currentToken, beginIndex, endIndex);
              });
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

