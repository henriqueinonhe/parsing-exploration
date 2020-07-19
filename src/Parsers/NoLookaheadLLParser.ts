import { Grammar } from "../Core/Grammar";
import { ParseTree } from "../Core/ParseTree";
import { TokenString } from "../Core/TokenString";

class Thread
{
  constructor()
  {

  }

  private 
}

export class NoLookaheadLLParser
{
  constructor(grammar : Grammar)
  {
    this.grammar = grammar;
  }

  public parse(inputString : TokenString) : ParseTree
  {
    
  }
  

  private readonly grammar : Grammar;
}