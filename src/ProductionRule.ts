import { TokenString } from "./TokenString";
import { Token } from "./Token";
import { Utils } from "./Utils";

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

  constructor(lhs : string, rhs : Array<string>)
  {
    const tokenStringLhs = new TokenString(lhs);
    const tokenStringRhs = rhs.map(string => new TokenString(string));

    ProductionRule.validateLhs(tokenStringLhs);
    ProductionRule.validateRhs(tokenStringRhs);
    const rhsWithoutDuplicates = Utils.removeArrayDuplicates(tokenStringRhs, (tokenString1, tokenString2) => tokenString1.isEqual(tokenString2));

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

  /**
   * Returns a list without duplicates of every token present 
   * in lhs and rhs token lists.
   */
  public everyTokenList() : Array<Token>
  {
    //Maybe use a hash table to speed up things
    const tokenList = this.lhs.getTokenList().slice();

    for(const tokenString of this.rhs)
    {
      tokenList.push(... tokenString.getTokenList());
    }
    
    return Utils.removeArrayDuplicates(tokenList, (token1, token2) => token1.isEqual(token2));
  }

  private readonly lhs : TokenString;
  private readonly rhs : Array<TokenString>;
}