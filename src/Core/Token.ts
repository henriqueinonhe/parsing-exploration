/**
 * Represents a token that is used to compose
 * [[TokenString]]s and that is treated as the 
 * smallest lexical element in a parsing environment.
 * 
 * A token encapsulates a string and 
 * accepts any sequence of characters
 * that doesn't contain whitespaces or double quotation
 * marks.
 * 
 */
export class Token
{
  /**
   * Validates token string.
   * It accepts as a string any sequence of
   * characters that doesn't contain whitespaces 
   * or double quotation marks.
   * 
   * @param tokenString 
   */
  private static validateTokenString(tokenString : string) : void
  {
    const validTokenStringRegex = /^[^\s"]+$/;
    if(!validTokenStringRegex.test(tokenString))
    {
      throw new Error("Invalid token string!");
    }
  }

  constructor(tokenString : string)
  {
    Token.validateTokenString(tokenString);
    this.tokenString = tokenString;
  }

  /**
   * Returns encapsulated string.
   */
  public toString() : string
  {
    return this.tokenString;
  }

  /**
   * Deep equality check.
   * 
   * @param other 
   */
  public isEqual(other : Token) : boolean
  {
    return other instanceof Token &&
           this.toString() === other.toString();
  }
  
  /**
   * Deep copy.
   */
  public clone() : Token
  {
    return new Token(this.toString());
  }

  private readonly tokenString : string;
}