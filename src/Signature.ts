import { Token } from "./Token";

interface TokenTable
{
  [key : string] : Token;
}

export class Signature
{
  constructor()
  {
    this.tokenTable = {};
  }

  /**
   * Returns a [[Token]] reference to the token
   * associated with the given tokenString if present,
   * otherwise throws an exception.
   * 
   * @param tokenString
   */
  public getTokenRef(tokenString : string) : Token
  {
    if(!this.tokenTable[tokenString])
    {
      throw new Error(`There is no token associated with "${tokenString}" present in the signature!`);
    }
    
    return this.tokenTable[tokenString];
  }

  /**
   * If there isn't any token present in the signature
   * with the same token string as tokenCandidate, adds 
   * tokenCandidate to the signature.
   * 
   * @param tokenCandidate 
   */
  public addToken(tokenCandidate : Token) : void
  {   
    const tokenCandidateKey = tokenCandidate.getTokenString();
    if(this.tokenTable[tokenCandidateKey])
    {
      throw new Error(`Token "${tokenCandidateKey}" already is in the signature!`);
    }

    this.tokenTable[tokenCandidateKey] = tokenCandidate;
  }

  private tokenTable : TokenTable;
}