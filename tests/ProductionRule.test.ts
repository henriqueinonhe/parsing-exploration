import { Signature } from "../src/Signature";
import { Token, TokenClass } from "../src/Token";
import { ProductionRule } from "../src/ProductionRule";

describe("constructor", () =>
{
  const signature = new Signature();
  signature.addToken(new Token("<expr>", TokenClass.NonTerminal));
  signature.addToken(new Token("<prim>", TokenClass.NonTerminal));
  signature.addToken(new Token("<comp>", TokenClass.NonTerminal));
  signature.addToken(new Token("(", TokenClass.Terminal));
  signature.addToken(new Token(")", TokenClass.Terminal));
  signature.addToken(new Token("i", TokenClass.Terminal));
  signature.addToken(new Token("o", TokenClass.Terminal));

  describe("Pre Conditions", () =>
  {
    test("Lhs cannot be empty", () =>
    {
      expect(() => {new ProductionRule(signature, "<expr>", "");})
    });
  });
});