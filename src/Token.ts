/**
 * Represents a Token that will compose a TokenString.
 */
export class Token
{
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

  constructor(tokenString : string)
  {
    Token.validateTokenString(tokenString);
    this.tokenString = tokenString;
  }

  public toString() : string
  {
    return this.tokenString;
  }

  public isEqual(other : Token) : boolean
  {
    return other instanceof Token &&
           this.toString() === other.toString();
  }
  
  private readonly tokenString : string;
}