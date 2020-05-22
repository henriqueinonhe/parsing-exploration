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

  private root : ParseTreeNode;
}