import { Token } from "./Token";

/**
 * Represents a token string that will be used for parsing.
 */
export class TokenString extends Array<Token>
{
  private static lex(string : string) : Array<Token>
  {
    const substringList = string.split(/ +/);
    const noEmptyPartsSubstringList = substringList.filter(substring => substring !== "");
    const tokenList = noEmptyPartsSubstringList.map(substring => new Token(substring));

    return tokenList;
  }

  //WARNING It is not clear how exactly this works, but it does and helps
  //immensely!
  constructor(...args : Array<Token>)
  {
    super(...args);
  }

  public static constructFromString(string : string) : TokenString
  {
    return new TokenString(... TokenString.lex(string));
  }

  /**
   * Returns string representation of the token list,
   * like a detonekization process.
   */
  public toString() : string
  {
    return this.reduce((string, token) => string += " " + token.toString(), "").trim();
  }

  /**
   * Checks if the string is empty, that is, contains no tokens.
   */
  public isEmpty() : boolean
  {
    return this.length === 0;
  }

  public isEqual(other : TokenString) : boolean
  {
    return other instanceof TokenString &&
           this.toString() === other.toString();
  }

  public size() : number
  {
    return this.length;
  }
}