import { ProductionRule } from "../src/ProductionRule";
import { TokenSort } from "../src/TokenTable";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Lhs must not be empty", () =>
    {
      expect(() => {ProductionRule.constructFromString("", ["Yada", "duba"]);}).toThrow("Left hand side of rule cannot be empty!");
    });

    test("Rhs must not be empty", () => 
    {
      expect(() => {ProductionRule.constructFromString("<expr>", []);}).toThrow("Right hand side of rule cannot be empty!");
      expect(() => {ProductionRule.constructFromString("<expr>", [""]);}).not.toThrow();
    });
  });

  describe("Post Conditions", () =>
  {
    test("Duplicate rhs options are removed", () =>
    {
      expect(ProductionRule.constructFromString("<expr>", ["AA", "B", "AA", "B", "AA", "C"]).getRhs().join(",")).toBe("AA,B,C");
    });
  });
});

describe("everyTokenList()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Lists every token", () =>
    {
      expect(ProductionRule.constructFromString("P <expr> Q", ["A + B", "C * D"]).everyTokenList().map(token => token.toString()).join(",")).toBe("P,<expr>,Q,A,+,B,C,*,D");
    });

    test("Removes duplicates", () =>
    {
      expect(ProductionRule.constructFromString("<expr>", ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"]).everyTokenList().map(token => token.toString()).join(",")).toBe("<expr>,(,+,),*,<digit>");
    });
  });
});

describe("isMonotonic()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const tokenTable = {
        "A" : TokenSort.NonTerminal,
        "B" : TokenSort.NonTerminal,
        "S" : TokenSort.NonTerminal,
        "a" : TokenSort.Terminal,
        "b" : TokenSort.Terminal,
        "C" : TokenSort.NonTerminal,
        "D" : TokenSort.NonTerminal
      };
      expect(ProductionRule.constructFromString("A", [""]).isMonotonic(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("A B", ["a"]).isMonotonic(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("a S b", ["S S S", "a b b", "a b a", "C D"]).isMonotonic(tokenTable)).toBe(false);

      expect(ProductionRule.constructFromString("A", ["a"]).isMonotonic(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("A", [" a b", "a b b", "S"]).isMonotonic(tokenTable)).toBe(true);
    });
  });
});

describe("isERule()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const tokenTable = {
        "A" : TokenSort.NonTerminal,
        "B" : TokenSort.NonTerminal,
        "S" : TokenSort.NonTerminal,
        "a" : TokenSort.Terminal,
        "b" : TokenSort.Terminal,
        "C" : TokenSort.NonTerminal,
        "D" : TokenSort.NonTerminal
      };
      expect(ProductionRule.constructFromString("S", [""]).isERule(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("a S b", [""]).isERule(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["", ""]).isERule(tokenTable)).toBe(true);


      expect(ProductionRule.constructFromString("S", ["a"]).isERule(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["", "b"]).isERule(tokenTable)).toBe(false);
      
    });
  });
});

describe("isContextFree()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const tokenTable = {
        "<expr>" : TokenSort.NonTerminal,
        "A" : TokenSort.NonTerminal,
        "B" : TokenSort.NonTerminal,
        "S" : TokenSort.NonTerminal,
        "a" : TokenSort.Terminal,
        "d" : TokenSort.Terminal,
        "C" : TokenSort.NonTerminal,
        "D" : TokenSort.NonTerminal
      };
      expect(ProductionRule.constructFromString("<expr>", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("<expr>", [""]).isContextFree(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("<expr>", ["a", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(true);

      expect(ProductionRule.constructFromString("a", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("A B", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(false);
    });
  });
});

describe("isRightRegular()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const tokenTable = {
        "S" : TokenSort.NonTerminal,
        "A" : TokenSort.NonTerminal,
        "a" : TokenSort.Terminal
      };
      expect(ProductionRule.constructFromString("S", ["a"]).isRightRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["a a a a a a"]).isRightRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["a a a a a a S"]).isRightRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["S"]).isRightRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", [""]).isRightRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["", "a", "a S", "a a a S", "S"]).isRightRegular(tokenTable)).toBe(true);

      expect(ProductionRule.constructFromString("S", ["S a"]).isRightRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["a S a"]).isRightRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["S S"]).isRightRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["a a a S S"]).isRightRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["", "a", "a S", "a a a S", "S", "S a"]).isRightRegular(tokenTable)).toBe(false);
    });
  });
});

describe("isLeftRegular()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const tokenTable = {
        "S" : TokenSort.NonTerminal,
        "A" : TokenSort.NonTerminal,
        "a" : TokenSort.Terminal
      };
      expect(ProductionRule.constructFromString("S", ["a"]).isLeftRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["a a a a a a"]).isLeftRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["S a a a a a a "]).isLeftRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["S"]).isLeftRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", [""]).isLeftRegular(tokenTable)).toBe(true);
      expect(ProductionRule.constructFromString("S", ["", "a", "S a", "S a a a", "S"]).isLeftRegular(tokenTable)).toBe(true);

      expect(ProductionRule.constructFromString("S", ["a S"]).isLeftRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["a S a"]).isLeftRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["S S"]).isLeftRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["S S a a a"]).isLeftRegular(tokenTable)).toBe(false);
      expect(ProductionRule.constructFromString("S", ["", "a", "S a", "S a a a", "S", "S S"]).isLeftRegular(tokenTable)).toBe(false);
    });
  });
});