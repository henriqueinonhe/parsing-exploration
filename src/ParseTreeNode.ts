import { Token } from "./Token";
import { ParseTree } from "./ParseTree";

export class ParseTreeNode
{
  constructor(tree : ParseTree, parent : ParseTreeNode | null, token : Token)
  {
    this.tree = tree;
    this.parent = parent;
    this.children = [];
    this.token = token;
  }

  public getTree() : ParseTree
  {
    return this.tree;
  }

  public getParent() : ParseTreeNode | null
  {
    return this.parent;
  }

  public getChildren() : Array<ParseTreeNode>
  {
    return this.children;
  }

  public getToken() : Token
  {
    return this.token;
  }

  public appendChild(token : Token) : ParseTreeNode
  {
    this.children.push(new ParseTreeNode(this.tree, this, token));
    return this;
  }

  public isRoot() : boolean
  {
    return this.parent === null;
  }

  private tree : ParseTree;
  private parent : ParseTreeNode | null;
  private children : Array<ParseTreeNode>;
  private token : Token;
}