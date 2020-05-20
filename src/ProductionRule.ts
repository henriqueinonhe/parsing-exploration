import { TokenString } from "./TokenString";
import { Signature } from "./Signature";
import { Lexer } from "./Lexer";

export class ProductionRule
{
  private static validateLhs(lhs : TokenString) : void
  {
    if(lhs.isEmpty())
    {
      throw new Error("Left hand side of rule cannot be empty!");
    }
  }

  private static validateRhs(rhs : Array<TokenString>) : void
  {
    if(rhs.length === 0)
    {
      throw new Error("Right hand side of rule cannot be empty!");
    }
  }

  private static removeRhsDuplicates(rhs : Array<TokenString>) : Array<TokenString>
  {
    const rhsWithoutDuplicates = [] as Array<TokenString>;
    for(const tokenString of rhs)
    {
      if(!rhsWithoutDuplicates.some(elem => elem.isEqual(tokenString)))
      {
        rhsWithoutDuplicates.push(tokenString);
      }
    }

    return rhsWithoutDuplicates;
  }

  constructor(signature : Signature, lhs : string, rhs : Array<string>)
  {
    const lexer = new Lexer(signature);
    const tokenStringLhs = lexer.lex(lhs);
    const tokenStringRhs = rhs.map(string => lexer.lex(string));

    ProductionRule.validateLhs(tokenStringLhs);
    ProductionRule.validateRhs(tokenStringRhs);
    const rhsWithoutDuplicates = ProductionRule.removeRhsDuplicates(tokenStringRhs);

    this.lhs = tokenStringLhs;
    this.rhs = rhsWithoutDuplicates;
  }

  public getLhs() : TokenString
  {
    return this.lhs;
  }

  public getRhs() : Array<TokenString>
  {
    return this.rhs;
  }

  private readonly lhs : TokenString;
  private readonly rhs : Array<TokenString>;
}