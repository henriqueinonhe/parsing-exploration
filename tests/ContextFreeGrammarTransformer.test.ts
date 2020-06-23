import { ContextFreeGrammarTransformer } from "../src/Transformers/ContextFreeGrammarTransformer";
import { Token } from "../src/Core/Token";
import { TokenString } from "../src/Core/TokenString";
import { ProductionRule } from "../src/Core/ProductionRule";
import { Grammar } from "../src/Core/Grammar";
import { TokenSort } from "../src/Core/TokenSortTable";

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

describe("generateNonUnitRuleAlternativeTokenString()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(ContextFreeGrammarTransformer["generateNonUnitRuleAlternativeTokenString"](new Token("A"), TokenString.fromString("a A"), [false]).toString()).toBe("a");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleAlternativeTokenString"](new Token("A"), TokenString.fromString("a A"), [true]).toString()).toBe("a A");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleAlternativeTokenString"](new Token("A"), TokenString.fromString("A a A"), [false, false]).toString()).toBe("a");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleAlternativeTokenString"](new Token("A"), TokenString.fromString("A a A"), [true, false]).toString()).toBe("A a");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleAlternativeTokenString"](new Token("A"), TokenString.fromString("A a A"), [false, true]).toString()).toBe("a A");

      expect(ContextFreeGrammarTransformer["generateNonUnitRuleAlternativeTokenString"](new Token("A"), TokenString.fromString("A a A"), [true, true]).toString()).toBe("A a A");
    });
  });
});

describe("generateERuleSubstitutionAlternatives()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(ContextFreeGrammarTransformer["generateERuleSubstitutionAlternatives"](TokenString.fromString("A"), TokenString.fromString("A a A")).map(tokenString => tokenString.toString())).toStrictEqual([
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

      expect(eFreeGrammar.getRules().length).toBe(3);
      expect(eFreeGrammar.getRules()[0].getRhs().map(alternative => alternative.toString())).toStrictEqual(["L a M", "a M", "L a", "a"]);
      expect(eFreeGrammar.getRules()[1].getRhs().map(alternative => alternative.toString())).toStrictEqual(["L M", "M", "L"]);
      expect(eFreeGrammar.getRules()[2].getRhs().map(alternative => alternative.toString())).toStrictEqual(["M M", "M"]);
    });
  });
});

describe("cleanGrammar()", () =>
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
      const cleanGrammar = ContextFreeGrammarTransformer.cleanGrammar(eFreeGrammar);

      expect(cleanGrammar.getRules().length).toBe(1);
      expect(cleanGrammar.getRules()[0].getRhs().map(alternative => alternative.toString())).toStrictEqual(["a"]);
    });
  });
});

describe("generateNonTerminalSubstitutionAlternatives()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const rule = ProductionRule.fromString("A", ["a", "b", "c c c"]);
      const alternative = TokenString.fromString("A B A");
      const generatedAlternatives = ContextFreeGrammarTransformer.generateNonTerminalSubstitutionAlternatives(rule, alternative);

      expect(generatedAlternatives.map(alternative => alternative.toString())).toStrictEqual([
        "a B a",
        "b B a",
        "c c c B a",
        "a B b",
        "b B b",
        "c c c B b",
        "a B c c c",
        "b B c c c",
        "c c c B c c c"
      ]);
    });

    test("", () =>
    {
      const rule = ProductionRule.fromString("A", ["A", "B", "A A"]);
      const alternative = TokenString.fromString("A A A");
      const generatedAlternatives = ContextFreeGrammarTransformer.generateNonTerminalSubstitutionAlternatives(rule, alternative);

      expect(generatedAlternatives.map(alternative => alternative.toString())).toStrictEqual([
        "A A A",
        "B A A",
        "A A A A",
        "A B A",
        "B B A",
        "A A B A",
        "A A A A",
        "B A A A",
        "A A A A A",
        "A A B",
        "B A B",
        "A A A B",
        "A B B",
        "B B B",
        "A A B B",
        "A A A B",
        "B A A B",
        "A A A A B",
        "A A A A",
        "B A A A",
        "A A A A A",
        "A B A A",
        "B B A A",
        "A A B A A",
        "A A A A A",
        "B A A A A",
        "A A A A A A"
      ]);
    });
  });
});

describe("substituteNonTerminalIntoRule()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminalAssociatedRule = ProductionRule.fromString("A", ["B", "a A"]);
      const rule = ProductionRule.fromString("B", ["A", "b A"]);
      const newRule = ContextFreeGrammarTransformer.substituteNonTerminalIntoRule(nonTerminalAssociatedRule, rule);

      expect(newRule.getLhs().toString()).toBe("B");
      expect(newRule.getRhs().map(alternative => alternative.toString())).toStrictEqual([
        "B",
        "a A",
        "b B",
        "b a A"
      ]);
    });
  });
});

describe("removeUnitRules()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      {
        const nonTerminals = ["S", "A", "B"];
        const terminals = ["a", "b", "c"];
        const rules = [
          {lhs: "S", rhs: ["A B"]},
          {lhs: "B", rhs: ["A"]},
          {lhs: "A", rhs: ["a", "b", "c", "A"]}
        ];
        const startSymbol = "S";
        const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
        const noUnitRulesGrammar = ContextFreeGrammarTransformer.removeUnitRules(grammar);
        const newRules = noUnitRulesGrammar.getRules();
  
        expect(newRules.length).toBe(3);
        
        expect(newRules[0].getLhs().toString()).toBe("S");
        expect(newRules[1].getLhs().toString()).toBe("B");
        expect(newRules[2].getLhs().toString()).toBe("A");
  
        expect(newRules[0].getRhs().map(alternative => alternative.toString())).toStrictEqual(["A B"]);
        expect(newRules[1].getRhs().map(alternative => alternative.toString())).toStrictEqual(["a", "b", "c"]);
        expect(newRules[2].getRhs().map(alternative => alternative.toString())).toStrictEqual(["a", "b", "c"]);
      }

      {
        const nonTerminals = ["S", "A", "B", "C", "D"];
        const terminals = ["a", "b"];
        const rules = [
          {lhs: "S", rhs: ["S", "S A", "B", "C C", "D D D"]},
          {lhs: "A", rhs: ["A", "a", "B", "C"]},
          {lhs: "B", rhs: ["B B", "A", "b"]}
        ];
        const startSymbol = "S";
        const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
        const newGrammar = ContextFreeGrammarTransformer.removeUnitRules(grammar);

        expect(newGrammar.getRules().map(rule => rule.toString())).toStrictEqual([
          `"S" -> "S A" | "B B" | "a" | "b" | "C C" | "D D D"`,
          `"A" -> "a" | "B B" | "b"`,
          `"B" -> "B B" | "a" | "b"`
        ]);
      }

    });
  });
});
