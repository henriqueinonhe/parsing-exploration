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

  constructor(string : string)
  {
    this.tokenList = TokenString.lex(string);
  }

  /**
   * Returns string representation of the token list,
   * like a detonekization process.
   */
  public toString() : string
  {
    return this.tokenList.reduce((string, token) => string += " " + token.toString(), "").trim();
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
           this.toString() === other.toString();
  }

  private readonly tokenList : Array<Token>;
}