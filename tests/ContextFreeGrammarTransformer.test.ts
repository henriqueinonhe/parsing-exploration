import { ContextFreeGrammarTransformer } from "../src/Transformers/ContextFreeGrammarTransformer";
import { Token } from "../src/Core/Token";
import { TokenString } from "../src/Core/TokenString";
import { ProductionRule } from "../src/Core/ProductionRule";
import { Grammar } from "../src/Core/Grammar";
import { TokenSort } from "../src/Core/TokenSortTable";

describe("advanceToNextIndicator()", () =>
{
  describe("Pre Conditions", () =>
  {
    expect(() => {ContextFreeGrammarTransformer["advanceToNextIndicator"]([true, true, true, true]);}).toThrow("Already at the last possible indicator!");
  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const indicator = [false, false, false, false];

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, false, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, false, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, false, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, false, true, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, true, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, true, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, true, false]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, false, false, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, false, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, false, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, true, false, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, false, true, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([true, false, true, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
      expect(indicator).toStrictEqual([false, true, true, true]);

      ContextFreeGrammarTransformer["advanceToNextIndicator"](indicator);
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
      expect(() => {ContextFreeGrammarTransformer["generateIndicatorList"](0);}).toThrow("must be > 0");
    });
  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      

      expect(ContextFreeGrammarTransformer["generateIndicatorList"](1)).toStrictEqual([
        [false],
        [true]
      ]);

      expect(ContextFreeGrammarTransformer["generateIndicatorList"](2)).toStrictEqual([
        [false, false],
        [true, false],
        [false, true],
        [true, true]
      ]);

      expect(ContextFreeGrammarTransformer["generateIndicatorList"](4)).toStrictEqual([
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
      expect(ContextFreeGrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("a A"), [false]).toString()).toBe("a");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("a A"), [true]).toString()).toBe("a A");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [false, false]).toString()).toBe("a");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [true, false]).toString()).toBe("A a");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [false, true]).toString()).toBe("a A");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleOptionTokenString"](new Token("A"), TokenString.fromString("A a A"), [true, true]).toString()).toBe("A a A");
    });
  });
});

describe("generateERuleSubstitutionOptions()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(ContextFreeGrammarTransformer["generateERuleSubstitutionOptions"](TokenString.fromString("A"), TokenString.fromString("A a A")).map(tokenString => tokenString.toString())).toStrictEqual([
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
      ContextFreeGrammarTransformer["substituteERuleLhsOccurrencesInRules"](rules, TokenString.fromString("A"));

      expect(rules[0].getLhs().toString()).toBe("B");
      expect(rules[1].getLhs().toString()).toBe("C");

      expect(rules[0].getRhs().map(tokenString => tokenString.toString())).toStrictEqual(["A a A", "b", "a", "A a", "a A"]);
      expect(rules[1].getRhs().map(tokenString => tokenString.toString())).toStrictEqual(["A", "c", ""]);
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
      const cleanedGrammar = ContextFreeGrammarTransformer.cleanGrammar(grammar);

      expect(cleanedGrammar.getTokenSortTable()["S"]).toBe(TokenSort.NonTerminal);
      expect(cleanedGrammar.getTokenSortTable()["A"]).toBe(TokenSort.NonTerminal);
      expect(cleanedGrammar.getTokenSortTable()["B"]).toBe(TokenSort.NonTerminal);
      expect(cleanedGrammar.getTokenSortTable()["a"]).toBe(TokenSort.Terminal);
      expect(cleanedGrammar.getTokenSortTable()["b"]).toBe(TokenSort.Terminal);
      expect(cleanedGrammar.getTokenSortTable()["c"]).toBe(undefined);
      expect(cleanedGrammar.getTokenSortTable()["d"]).toBe(undefined);

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
      const eFreeGrammar = ContextFreeGrammarTransformer.removeERules(grammar);

      expect(eFreeGrammar.getRules().length).toBe(1);
      expect(eFreeGrammar.getRules()[0].getRhs().map(option => option.toString())).toStrictEqual([ "a"]);
      
    });
  });
});