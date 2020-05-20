import { Token } from "./Token";

/**
 * Represents a pool of tokens from which 
 * the lexer will draw from.
 */
export class Signature
{
  constructor()
  {
    this.tokenList = [];
  }

  /**
   * Adds a new token to the signature if it is not
   * already present, throws exception otherwise.
   * 
   * @param token 
   */
  public addToken(token : Token) : void
  {
    if(this.tokenIsPresent(token))
    {
      throw new Error(`Token "${token.getTokenString()}" is already present in the signature!`);
    }

    this.tokenList.push(token);
  }

  /**
   * Checks whether a token with a given token string is already
   * present in the token list.
   * 
   * @param candidateToken 
   */
  private tokenIsPresent(candidateToken : Token) : boolean
  {
    return this.tokenList.some( (tokenInList) => 
    {
      return tokenInList.getTokenString() === candidateToken.getTokenString();
    });
  }

  public getTokenRef(string : string) : Token
  {
    
  }

  private tokenList : Array<Token>;
}