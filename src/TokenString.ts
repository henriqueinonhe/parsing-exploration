import { Token } from "./Token";

/**
 * Represents a token string that will be used for parsing.
 */
export class TokenString
{
  private static lex(string : string) : Array<Token>
  {
    const substringList = string.split(/ +/);
    const noEmptyPartsSubstringList = substringList.filter(substring => substring !== "");
    const tokenList = noEmptyPartsSubstringList.map(substring => new Token(substring));

    return tokenList;
  }

  constructor(tokenList : Array<Token>)
  {
    this.tokenList = tokenList;
  }

  public static constructFromString(string : string) : TokenString
  {
    return new TokenString(TokenString.lex(string));
  }

  public getTokenList() : Array<Token>
  {
    return this.tokenList;
  }

  public tokenAt(index : number) : Token
  {
    return this.tokenList[index];
  }

  /**
   * Returns string representation of the token list,
   * like a detonekization process.
   */
  public toString() : string
  {
    return this.tokenList.reduce((string, token) => string += " " + token.toString(), "").trim();
  }

  /**
   * Checks if the string is empty, that is, contains no tokens.
   */
  public isEmpty() : boolean
  {
    return this.tokenList.length === 0;
  }

  public isEqual(other : TokenString) : boolean
  {
    return other instanceof TokenString &&
           this.toString() === other.toString();
  }

  public size() : number
  {
    return this.tokenList.length;
  }

  public slice(startIndex ? : number | undefined, endIndex ? : number | undefined) : TokenString
  {
    return new TokenString(this.tokenList.slice(startIndex, endIndex));
  }

  public startsWith(other : TokenString) : boolean
  {
    for(let index = 0; index < other.size(); index++)
    {
      if(index >= this.size())
      {
        return false;
      }

      if(!this.tokenAt(index).isEqual(other.tokenAt(index)))
      {
        return false;
      }
    }

    return true;
  }

  public endsWith(other : TokenString) : boolean
  {
    const zeroIndexBasedCompensation = 1;
    for(let count = 0; count < other.size(); count++)
    {
      const thisIndex = this.size() - count - zeroIndexBasedCompensation;
      const otherIndex = other.size() - count - zeroIndexBasedCompensation;
      if(thisIndex < 0)
      {
        return false;
      }

      if(!this.tokenAt(thisIndex).isEqual(other.tokenAt(otherIndex)))
      {
        return false;
      }
    }

    return true;
  }

  public every(callbackfn : (value : Token, index : number, array : Array<Token>) => unknown, thisArg ? : TokenString/* This was "any" in the original declaration */) : boolean
  {
    return this.tokenList.every(callbackfn, thisArg);
  }

  private readonly tokenList : Array<Token>
}