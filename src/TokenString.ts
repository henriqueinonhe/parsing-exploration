import { Token } from "./Token";

/**
 * Represents a token string that will be used for parsing.
 */
export class TokenString
{
  constructor(tokenList : Array<Token>)
  {
    this.tokenList = tokenList;
  }

  /**
   * Returns string representation of the token list,
   * like a detonekization process.
   */
  public toString() : string
  {
    return this.tokenList.reduce((string, token) => string += " " + token.getTokenString(), "").trim();
  }

  public getTokenList() : Array<Token>
  {
    return this.tokenList;
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
           this.getTokenList().length === other.getTokenList().length &&
           this.getTokenList().every((thisToken, currentIndex) => thisToken.isEqual(other.getTokenList()[currentIndex]));
  }

  private readonly tokenList : Array<Token>;
}