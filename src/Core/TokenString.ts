import { Token } from "./Token";
import { validateIndex } from "./LogosUtils";
import { Utils } from "./Utils";

/**
 * Represents a sequence of tokens.
 * 
 * Used as strings in the parsing environment.
 */
export class TokenString
{

  /**
   * Lexes a given string, breaking it into
   * tokens.
   * 
   * Whitespace is used as token separator.
   * 
   * @param string 
   * @returns Token list
   */
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

  /**
   * Alternative constructor that uses
   * a string as argument instead of a token list.
   * 
   * It builds a token string by lexing the 
   * given string.
   * 
   * @param string 
   */
  public static fromString(string : string) : TokenString
  {
    return new TokenString(TokenString.lex(string));
  }

  /**
   * Returns internal token list by value.
   */
  public getTokenList() : Array<Token>
  {
    return Utils.cloneArray(this.tokenList);
  }

  /**
   * Returns token at a given index by value.
   * 
   * @param index 
   */
  public tokenAt(index : number) : Token
  {
    validateIndex(index, "index", this.tokenList.length, "tokenList");
    return this.tokenList[index].clone();
  }

  /**
   * Returns string representation of the token list.
   */
  public toString() : string
  {
    return this.tokenList.reduce((string, token) => string += " " + token.toString(), "").trim();
  }

  /**
   * Checks if the string is empty, that is, 
   * contains no tokens.
   */
  public isEmpty() : boolean
  {
    return this.tokenList.length === 0;
  }

  /**
   * Deep equality check.
   * 
   * @param other 
   */
  public isEqual(other : TokenString) : boolean
  {
    return other instanceof TokenString &&
           this.toString() === other.toString();
  }

  /**
   * Returns the number of tokens present 
   * in the token string.
   */
  public size() : number
  {
    return this.tokenList.length;
  }

  /**
   * TokenString equivalent of JS's 
   * String slice.
   * 
   * @param startIndex 
   * @param endIndex 
   */
  public slice(startIndex ? : number | undefined, endIndex ? : number | undefined) : TokenString
  {
    return new TokenString(this.tokenList.slice(startIndex, endIndex));
  }

  /**
   * TokenString equivalent of JS's
   * String startsWith.
   * 
   * @param other 
   */
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

  /**
   * TokenString equivalent of JS's
   * String endsWith.
   * 
   * @param other 
   */
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

  /**
   * TokenString equivalent of JS's Array
   * every.
   * 
   * @param callbackfn 
   * @param thisArg 
   */
  public every(callbackfn : (value : Token, index : number, array : Array<Token>) => unknown, thisArg ? : TokenString/* This was "any" in the original declaration */) : boolean
  {
    return this.tokenList.every(callbackfn, thisArg);
    
  }

  /**
   * TokenString equivalent of JS's Array
   * some.
   * 
   * @param callbackfn 
   * @param thisArg 
   */
  public some(callbackfn : (value : Token, index : number, array : Array<Token>) => unknown, thisArg ? : TokenString/* This was "any" in the original declaration */) : boolean
  {
    return this.tokenList.some(callbackfn, thisArg);
    
  }

  /**
   * TokenString equivalent of JS's array
   * reduce.
   * 
   * @param callbackfn 
   * @param initialValue 
   */
  public reduce<T>(callbackfn : (previousValue : T, currentValue : Token, currentIndex : number, array : Token[]) => T, initialValue : T) : T
  {
    return this.tokenList.reduce<T>(callbackfn, initialValue);
  }

  
  /**
   * Deep copy.
   */
  public clone() : TokenString
  {
    return new TokenString(Utils.cloneArray(this.tokenList));
  }

  /**
   * Checks whether a given tokenString is a substring
   * of this from a given index.
   * 
   * @param tokenString 
   * @param startIndex 
   */
  public includes(tokenString : TokenString, startIndex = 0) : boolean
  {
    validateIndex(startIndex, "startIndex", tokenString.size(), "tokenString");

    for(let index = startIndex; index < this.size(); index++)
    {
      if(this.slice(index, index + tokenString.size()).isEqual(tokenString))
      {
        return true;
      }
    }

    return false;
  }

  public splice(start : number, deleteCount : number, ...insertItems : Array<Token>) : TokenString
  {
    this.tokenList.splice(start, deleteCount, ...insertItems);
    return this;
  }

  private readonly tokenList : Array<Token>;
}