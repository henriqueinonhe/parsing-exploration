import { GrammarTransformer } from "../src/Transformers/GrammarTransformer";
import { Token } from "../src/Core/Token";
import { TokenString } from "../src/Core/TokenString";
import { ProductionRule } from "../src/Core/ProductionRule";
import { Grammar } from "../src/Core/Grammar";
import { TokenSort } from "../src/Core/TokenTable";

const nonTerminals = ["S", "L", "M"];
      const terminals = ["a"];
      const rules = [
        {lhs: "S", rhs: ["L a M"]},
        {lhs: "L", rhs: ["L M", ""]},
        {lhs: "M", rhs: ["M M", ""]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const eFreeGrammar = GrammarTransformer.removeERules(grammar);

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
      expect(rules[1].getRhs().map(tokenString => tokenString.toString())).toStrictEqual(["A", "c", "", "A"]);
    });
  });
});

describe("cleanGrammar()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c", "d"];
      const rules = [
        {lhs: "S", rhs: ["A", "A S"]},
        {lhs: "A", rhs: ["a", "B"]},
        {lhs: "B", rhs: ["b"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const cleanedGrammar = GrammarTransformer.cleanGrammar(grammar);

      expect(cleanedGrammar.getTokenTable()["S"]).toBe(TokenSort.NonTerminal);
      expect(cleanedGrammar.getTokenTable()["A"]).toBe(TokenSort.NonTerminal);
      expect(cleanedGrammar.getTokenTable()["B"]).toBe(TokenSort.NonTerminal);
      expect(cleanedGrammar.getTokenTable()["a"]).toBe(TokenSort.Terminal);
      expect(cleanedGrammar.getTokenTable()["b"]).toBe(TokenSort.Terminal);
      expect(cleanedGrammar.getTokenTable()["c"]).toBe(undefined);
      expect(cleanedGrammar.getTokenTable()["d"]).toBe(undefined);

      expect(cleanedGrammar.getRules().length).toBe(3);
    });
  });
});

describe("removeERules()", () =>
{
  describe("Post Conditions",  () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "L", "M"];
      const terminals = ["a"];
      const rules = [
        {lhs: "S", rhs: ["L a M"]},
        {lhs: "L", rhs: ["L M", ""]},
        {lhs: "M", rhs: ["M M", ""]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const eFreeGrammar = GrammarTransformer.removeERules(grammar);

      // expect(eFreeGrammar.getRules()[0].getRhs().map(option => option.toString())).toStrictEqual(["L a M", "a M", "L a", "a"]);
      // expect(eFreeGrammar.getRules()[1].getRhs().map(option => option.toString())).toStrictEqual(["L M", "L"]);
      // expect(eFreeGrammar.getRules()[2].getRhs().map(option => option.toString())).toStrictEqual(["M M"]);
    });
  });
});