import { Signature } from "./Signature";
import { TokenString } from "./TokenString";

export class Lexer
{
  constructor(signature : Signature)
  {
    this.signature = signature;
  }

  public lex(string : string) : TokenString
  {
    const substringList = string.split(/ +/);
    const noEmptyPartsSubstringList = substringList.filter(substring => substring !== "");
    const tokenList = noEmptyPartsSubstringList.map(substring => this.signature.getTokenRef(substring));

    return new TokenString(tokenList);
  }

  private readonly signature : Signature;
}