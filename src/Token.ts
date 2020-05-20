/**
 * Represents a Token that will compose a TokenString.
 */
export class Token
{
  /**
   * Validates token class using the regex /^[A-z][A-z0-9]*$/.
   * 
   * @param string 
   */
  private static validateTokenClass(string : string) : void
  {
    const validTokenClassRegex = /^[A-z][A-z0-9]*$/;
    if(!validTokenClassRegex.test(string))
    {
      throw new Error("Invalid token class!");
    }
  }

  /**
   * Valiates token string, making sure it is not a whitespace character.
   * 
   * @param tokenString 
   */
  private static validateTokenString(tokenString : string) : void
  {
    const validTokenStringRegex = /^\S+$/;
    if(!validTokenStringRegex.test(tokenString))
    {
      throw new Error("Invalid token string!");
    }
  }

  constructor(tokenString : string, tokenClass : string)
  {
    Token.validateTokenString(tokenString);
    Token.validateTokenClass(tokenClass);
    this.tokenString = tokenString;
    this.tokenClass = tokenClass;
  }

  public getTokenString() : string
  {
    return this.tokenString;
  }

  public getTokenClass() : string
  {
    return this.tokenClass;
  }

  public isEqual(other : Token) : boolean
  {
    return other instanceof Token &&
           this.getTokenString() == other.getTokenString() &&
           this.getTokenClass() == other.getTokenClass();
  }

  private readonly tokenString : string;
  private readonly tokenClass : string;
}