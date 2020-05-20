import { Signature } from "../src/Signature";
import { Token, TokenClass } from "../src/Token";
import { Lexer } from "../src/Lexer";

describe("lex()", () =>
{
  describe("Post Conditions", () =>
  {
    test("One digit sum tokens", () =>
    {
      const signature = new Signature();
      signature.addToken(new Token("S", TokenClass.NonTerminal));
      signature.addToken(new Token("("));
      signature.addToken(new Token(")"));
      signature.addToken(new Token("0"));
      signature.addToken(new Token("1"));
      signature.addToken(new Token("2"));
      signature.addToken(new Token("3"));
      signature.addToken(new Token("4"));
      signature.addToken(new Token("5"));
      signature.addToken(new Token("6"));
      signature.addToken(new Token("7"));
      signature.addToken(new Token("8"));
      signature.addToken(new Token("9"));
      signature.addToken(new Token("+"));
      const lexer = new Lexer(signature);

      expect(lexer.lex("S").toString()).toBe("S");
      expect(lexer.lex("( S + S ) + 1 + 2 + 5").toString()).toBe("( S + S ) + 1 + 2 + 5");
    });

    test("Tokens with more than one character", () =>
    {
      const signature = new Signature();
      signature.addToken(new Token("Expr", TokenClass.NonTerminal));
      signature.addToken(new Token("P"));
      signature.addToken(new Token("Q"));
      signature.addToken(new Token("->"));
      const lexer = new Lexer(signature);

      expect(lexer.lex("Expr").toString()).toBe("Expr");
      expect(lexer.lex("Expr -> Expr").toString()).toBe("Expr -> Expr");
      expect(lexer.lex("Q -> P -> Q -> P").toString()).toBe("Q -> P -> Q -> P");
    });
  });
});