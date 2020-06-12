import { Grammar } from "../Core/Grammar";

export class CYKParser
{
  constructor(grammar : Grammar)
  {
    if(!grammar.isContextFree())
    {
      throw new Error("This parser only works on context free grammars!");
    }

    this.grammar = grammar;
  }

  readonly grammar : Grammar;
}