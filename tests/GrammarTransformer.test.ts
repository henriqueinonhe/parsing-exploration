import { GrammarTransformer } from "../src/GrammarTransformer";
import { Token } from "../src/Token";
import { TokenString } from "../src/TokenString";
import { ProductionRule } from "../src/ProductionRule";

const rules = [
  ProductionRule.fromString("B", ["A a A", "b"]),
  ProductionRule.fromString("C", ["A", "c"])
];
GrammarTransformer["substituteERuleLhsOccurrencesInRules"](rules, TokenString.fromString("A"));

describe("advanceToNextIndicator()", () =>
{
  describe("Pre Conditions", () =>
  {
    expect(() => {GrammarTransformer["advanceToNextIndicator"]([true, true, true, true]);}).toThrow("Already at the last possible indicator!");
  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const indicator = [false, false, false, false];

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, false, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, false, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, false, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, false, true, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, true, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, true, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, true, false]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, false, false, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, false, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, false, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, false, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, false, true, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, true, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, true, true]);

      GrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, true, true]);

    });
  });
});

describe("generateIndicatorList()", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Size must be > 0", () =>
    {
      expect(() => {GrammarTransformer["generateIndicatorList"](0);}).toThrow("must be > 0");
    });
  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      

      expect(GrammarTransformer["generateIndicatorList"](1)).toStrictEqual([
        [false],
        [true]
      ]);

      expect(GrammarTransformer["generateIndicatorList"](2)).toStrictEqual([
        [false, false],
        [true, false],
        [false, true],
        [true, true]
      ]);

      expect(GrammarTransformer["generateIndicatorList"](4)).toStrictEqual([
        [false, false, false, false],
        [true, false, false, false],
        [false, true, false, false],
        [true, true, false, false],
        [false, false, true, false],
        [true, false, true, false],
        [false, true, true, false],
        [true, true, true, false],
        [false, false, false, true],
        [true, false, false, true],
        [false, true, false, true],
        [true, true, false, true],
        [false, false, true, true],
        [true, false, true, true],
        [false, true, true, true],
        [true, true, true, true]
      ]);
    });
  });
});

describe("generateNonUnitRuleOptionTokenString()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(GrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("a A"), [false]).toString()).toBe("a");

      expect(GrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("a A"), [true]).toString()).toBe("a A");

      expect(GrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [false, false]).toString()).toBe("a");

      expect(GrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [true, false]).toString()).toBe("A a");

      expect(GrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [false, true]).toString()).toBe("a A");

      expect(GrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [true, true]).toString()).toBe("A a A");
    });
  });
});

describe("generateNonUnitRuleOptions()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(GrammarTransformer["generateNonUnitRuleOptions"](TokenString.fromString("A"), TokenString.fromString("A a A")).map(tokenString => tokenString.toString())).toStrictEqual([
        "a",
        "A a",
        "a A",
        "A a A"
      ]);
    });
  });
});

describe("substituteERuleLhsOccurrencesInRules()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const rules = [
        ProductionRule.fromString("B", ["A a A", "b"]),
        ProductionRule.fromString("C", ["A", "c"])
      ];
      GrammarTransformer["substituteERuleLhsOccurrencesInRules"](rules, TokenString.fromString("A"));

      expect(rules[0].getLhs().toString()).toBe("B");
      expect(rules[1].getLhs().toString()).toBe("C");

      expect(rules[0].getRhs().map(tokenString => tokenString.toString())).toStrictEqual(["A a A", "b", "a", "A a", "a A", "A a A"]);
      expect(rules[1].getRhs().map(tokenString => tokenString.toString())).toStrictEqual(["A", "c", ""]);
    });
  });
});