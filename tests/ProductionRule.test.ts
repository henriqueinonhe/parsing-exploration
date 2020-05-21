import { ProductionRule } from "../src/ProductionRule";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Lhs must not be empty", () =>
    {
      expect(() => {new ProductionRule("", ["Yada", "duba"]);}).toThrow("Left hand side of rule cannot be empty!");
    });

    test("Rhs must not be empty", () => 
    {
      expect(() => {new ProductionRule("<expr>", []);}).toThrow("Right hand side of rule cannot be empty!");
      expect(() => {new ProductionRule("<expr>", [""]);}).not.toThrow();
    });
  });

  describe("Post Conditions", () =>
  {
    test("Duplicate rhs options are removed", () =>
    {
      expect(new ProductionRule("<expr>", ["AA", "B", "AA", "B", "AA", "C"]).getRhs().join(",")).toBe("AA,B,C");
    });
  });
});

describe("everyTokenList()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Lists every token", () =>
    {
      expect(new ProductionRule("P <expr> Q", ["A + B", "C * D"]).everyTokenList().map(token => token.toString()).join(",")).toBe("P,<expr>,Q,A,+,B,C,*,D");
    });

    test("Removes duplicates", () =>
    {
      expect(new ProductionRule("<expr>", ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"]).everyTokenList().map(token => token.toString()).join(",")).toBe("<expr>,(,+,),*,<digit>");
    });
  });
});