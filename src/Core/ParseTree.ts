import { ParseTreeNode } from "./ParseTreeNode";
import { Token } from "./Token";

export class ParseTree
{
  constructor(token : Token)
  {
    this.root = new ParseTreeNode(this, null, token);
  }

  public static constructFromString(string : string) : ParseTree
  {
    return new ParseTree(new Token(string));
  }

  public getRoot() : ParseTreeNode
  {
    return this.root;
  }

  public clone() : ParseTree
  {
    const newParseTree = new ParseTree(this.root.getToken());
    const oldTreeQueue = [this.root];
    const newTreeQueue = [newParseTree.root];
    while(oldTreeQueue.length !== 0)
    {
      const currentOldNode = oldTreeQueue[0];
      const currentNewNode = newTreeQueue[0];
      for(const child of currentOldNode.getChildren())
      {
        currentNewNode.appendChild(child.getToken());
        oldTreeQueue.push(child);
      }
      for(const child of currentNewNode.getChildren())
      {
        newTreeQueue.push(child);
      }
      oldTreeQueue.shift();
      newTreeQueue.shift();
    }
    return newParseTree;
  }

  private root : ParseTreeNode;
}