import { TokenString } from "./TokenString";
import { Token } from "./Token";
import { Utils } from "./Utils";
import { TokenTable, TokenSort } from "./TokenTable";

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

  constructor(lhs : TokenString, rhs : Array<TokenString>)
  {
    ProductionRule.validateLhs(lhs);
    ProductionRule.validateRhs(rhs);
    const rhsWithoutDuplicates = Utils.removeArrayDuplicates(rhs, (tokenString1, tokenString2) => tokenString1.isEqual(tokenString2));

    this.lhs = lhs;
    this.rhs = rhsWithoutDuplicates;
  }

  public static constructFromString(lhs : string, rhs : Array<string>) : ProductionRule
  {
    const tokenStringLhs = TokenString.constructFromString(lhs);
    const tokenStringRhs = rhs.map(string => TokenString.constructFromString(string));
    return new ProductionRule(tokenStringLhs, tokenStringRhs);
  }

  public getLhs() : TokenString
  {
    return this.lhs;
  }

  public getRhs() : Array<TokenString>
  {
    return this.rhs;
  }

  public checkValidityWithinContext(tokenTable : TokenTable) : void
  {
    const missingTokens = [] as Array<Token>;
    for(const token of this.everyTokenList())
    {
      if(tokenTable[token.toString()] === undefined)
      {
        missingTokens.push(token);
      }
    }

    if(missingTokens.length !== 0)
    {
      throw new Error(`This rule is not valid in the context of the given token table, because the following tokens are occur in the rule but are absent from the table: "${missingTokens.map(token => token.toString()).join(`", "`)}"!`);
    }
  }

  /**
   * Returns a list without duplicates of every token present 
   * in lhs and rhs token lists.
   */
  public everyTokenList() : Array<Token>
  {
    //Maybe use a hash table to speed up things
    const tokenList = this.lhs.slice();

    for(const tokenString of this.rhs)
    {
      tokenList.push(... tokenString);
    }
    
    return Utils.removeArrayDuplicates(tokenList, (token1, token2) => token1.isEqual(token2));
  }

  public mergeRule(other : ProductionRule) : ProductionRule
  {
    if(!this.getLhs().isEqual(other.getLhs()))
    {
      throw new Error(`Cannot merge rules as their left hand sides differ!
      "${this.getLhs().toString()}" !== "${other.getLhs().toString()}"`);
    }

    const thisRhs = this.getRhs();
    const otherRhs = other.getRhs();
    const mergedRhs = [... thisRhs];
    for(const option of otherRhs)
    {
      if(mergedRhs.every(elem => !elem.isEqual(option)))
      {
        mergedRhs.push(option);
      }
    }
    return new ProductionRule(this.getLhs(), mergedRhs);
  }

  public isMonotonic(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.rhs.every(option => option.size() >= this.lhs.size());
  }

  //FIXME!
  public isERule(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.rhs.length === 1 &&
           this.rhs[0].isEmpty();
  }

  public isContextFree(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.lhs.length === 1 &&
           tokenTable[this.lhs[0].toString()] === TokenSort.NonTerminal;
  }

  public isRightRegular(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.isContextFree(tokenTable) &&
           this.rhs.every(option => option.slice(0, -1).every(token => tokenTable[token.toString()] === TokenSort.Terminal));
  }

  public isLeftRegular(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    return this.isContextFree(tokenTable) &&
           this.rhs.every(option => option.slice(1).every(token => tokenTable[token.toString()] === TokenSort.Terminal));
  }

  public isContextSensitive(tokenTable : TokenTable) : boolean
  {
    this.checkValidityWithinContext(tokenTable);
    //TODO
    const lhs = this.lhs;
    for(const option of this.rhs)
    {
      let leftPivotIndex = undefined;
      for(let index = 0; index < lhs.length && index < option.length; index++)
      {
        const currentLhsToken = lhs[index];
        const currentOptionToken = option[index];
        if(!currentLhsToken.isEqual(currentOptionToken))
        {
          if(tokenTable[currentLhsToken.toString()] !== TokenSort.NonTerminal)
          {
            return false;
          }
          else
          {
            leftPivotIndex = index;
            break;
          }
        }
      }

      let rightPivotIndex = undefined;
      for(let count = 0; )
    }
  }

  private readonly lhs : TokenString;
  private readonly rhs : Array<TokenString>;
}