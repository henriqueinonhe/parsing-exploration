import { TokenString } from "../src/TokenString";
import { Token, TokenClass } from "../src/Token";

describe("toString()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new TokenString([]).toString()).toBe("");
      expect(new TokenString([new Token("Dobs")]).toString()).toBe("Dobs");
      expect(new TokenString([new Token("i"), new Token("->"), new Token("o")]).toString()).toBe("i -> o");
      expect(new TokenString("Forall x Exists y P ( x ) -> P ( y )".split(/ +/) 
        .filter(string => string !== "")
        .map(string => new Token(string))).toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
    });
  });
});

describe("isEmpty()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new TokenString([]).isEmpty()).toBe(true);
      expect(new TokenString([new Token("a")]).isEmpty()).toBe(false);
    });
  });
});

describe("isEqual()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new TokenString([]).isEqual(new TokenString([]))).toBe(true);
      expect(new TokenString([new Token("A", TokenClass.NonTerminal)])
        .isEqual(new TokenString([new Token("A", TokenClass.Terminal)]))).toBe(false);
      expect(new TokenString([new Token("A", TokenClass.Terminal)])
        .isEqual(new TokenString([new Token("A", TokenClass.Terminal)]))).toBe(true);
      expect(new TokenString([new Token("A", TokenClass.NonTerminal),
                              new Token("B")])
        .isEqual(new TokenString([new Token("A", TokenClass.Terminal),
                                  new Token("B")]))).toBe(false);
    });
  });
});