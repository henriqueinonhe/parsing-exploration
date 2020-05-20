export enum TokenClass
{
  Terminal,
  NonTerminal
}

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

  constructor(tokenString : string, tokenClass = TokenClass.Terminal)
  {
    Token.validateTokenString(tokenString);
    this.tokenString = tokenString;
    this.tokenClass = tokenClass;
  }

  public getTokenString() : string
  {
    return this.tokenString;
  }

  public isEqual(other : Token) : boolean
  {
    return other instanceof Token &&
           this.getTokenString() === other.getTokenString() &&
           this.isTerminal() === other.isTerminal();
  }

  public isTerminal() : boolean
  {
    return this.tokenClass === TokenClass.Terminal;
  }

  private readonly tokenString : string;
  private readonly tokenClass : TokenClass;
}