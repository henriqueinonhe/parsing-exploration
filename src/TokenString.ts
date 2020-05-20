import { Token } from "./Token";

/**
 * Represents a token string that will be used for parsing.
 */
export class TokenString
{
  /**
   * Lexes a given string splitting it into tokens.
   * 
   * @param string 
   */
  private static lex(string : string) : Array<Token>
  {
    return string.split(/ +/).map(substring => new Token(substring));
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
    //This final slice is to remove the first trailing whitespace
    return this.tokenList.reduce((string, token) => string += " " + token.getString(), "").trim();
  }

  private readonly tokenList : Array<Token>;
}