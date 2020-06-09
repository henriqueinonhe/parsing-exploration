import { ParseTreeNode } from "./ParseTreeNode";
import { ParseTree } from "./ParseTree";

export class ParseTreeIterator
{
  constructor(tree : ParseTree)
  {
    this.currentNode = tree.getRoot();
  }

  public goToParent() : void
  {
    if(this.currentNode.isRoot())
    {
      throw new Error("Cannot go to parent, for this node is root!");
    }

    this.currentNode = this.currentNode.getParent() as ParseTreeNode;
  }

  public goToNthChild(index : number) : void
  {
    if(index >= this.currentNode.getChildren().length)
    {
      throw new Error(`You tried to access a non existent child!`);
    }

    this.currentNode = this.currentNode.getChildren()[index];
  }

  public goToRoot() : void
  {
    this.currentNode = this.currentNode.getTree().getRoot();
  } 

  private currentNode : ParseTreeNode;
}