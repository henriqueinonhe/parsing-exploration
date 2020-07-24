import { Grammar } from "../src/Core/Grammar";
import { LL1Parser } from "../src/Parsers/LL1Parser";

describe("computeTokensThatDeriveEmptyStringSet()", () =>
{
  describe("Pre Conditions", () =>
  {

  });

  describe("Post Conditions", () =>
  {
    
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C", "D"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A", "a A", "A B C", "S D"]},
        {lhs: "A", rhs: ["a a a", "b", "B B"]},
        {lhs: "B", rhs: ["b b", ""]},
        {lhs: "C", rhs: ["B", "c"]},
        {lhs: "D", rhs: ["a b c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  
      const emptySet = LL1Parser["computeTokensThatDeriveEmptyStringSet"](grammar);

      expect(emptySet.has("S")).toBe(true);
      expect(emptySet.has("A")).toBe(true);
      expect(emptySet.has("B")).toBe(true);
      expect(emptySet.has("C")).toBe(true);
      expect(emptySet.has("D")).toBe(false);
    });
  });
});

describe("computeFirstSets()", () =>
{
  describe("Pre Conditions", () =>
  {

  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A", "a A", "A B C"]},
        {lhs: "A", rhs: ["a a a", "b", "B B"]},
        {lhs: "B", rhs: ["b b", ""]},
        {lhs: "C", rhs: ["B", "c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  
      const emptySet = LL1Parser["computeTokensThatDeriveEmptyStringSet"](grammar);
      const firstSets = LL1Parser["computeFirstSets"](grammar, emptySet);
      
      expect(firstSets["S"].has("a")).toBe(true);
      expect(firstSets["S"].has("b")).toBe(true);
      expect(firstSets["S"].has("c")).toBe(true);

      expect(firstSets["A"].has("a")).toBe(true);
      expect(firstSets["A"].has("b")).toBe(true);
      expect(firstSets["A"].has("c")).toBe(false);

      expect(firstSets["B"].has("a")).toBe(false);
      expect(firstSets["B"].has("b")).toBe(true);
      expect(firstSets["B"].has("c")).toBe(false);

      expect(firstSets["C"].has("a")).toBe(false);
      expect(firstSets["C"].has("b")).toBe(true);
      expect(firstSets["C"].has("c")).toBe(true);
    });
  });
});

describe("computeFollowSets()", () =>
{
  describe("Pre Conditions", () =>
  {

  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A", "a A", "A B C"]},
        {lhs: "A", rhs: ["a a a", "b", "B B"]},
        {lhs: "B", rhs: ["b b", ""]},
        {lhs: "C", rhs: ["B", "c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  
      const emptySet = LL1Parser["computeTokensThatDeriveEmptyStringSet"](grammar);
      const firstSets = LL1Parser["computeFirstSets"](grammar, emptySet);
      const followSets = LL1Parser["computeFollowSets"](grammar, emptySet, firstSets);

      expect(followSets["S"].has("a")).toBe(false);
      expect(followSets["S"].has("b")).toBe(false);
      expect(followSets["S"].has("c")).toBe(false);

      expect(followSets["A"].has("a")).toBe(false);
      expect(followSets["A"].has("b")).toBe(true);
      expect(followSets["A"].has("c")).toBe(true);

      expect(followSets["B"].has("a")).toBe(false);
      expect(followSets["B"].has("b")).toBe(true);
      expect(followSets["B"].has("c")).toBe(true);

      expect(followSets["C"].has("a")).toBe(false);
      expect(followSets["C"].has("b")).toBe(false);
      expect(followSets["C"].has("c")).toBe(false);
    });
  });
});

describe("computeParseTable()", () =>
{
  describe("Pre Conditions", () =>
  {

  });

  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A", "a A", "A B C"]},
        {lhs: "A", rhs: ["a a a", "b", "B B"]},
        {lhs: "B", rhs: ["b b", ""]},
        {lhs: "C", rhs: ["B", "c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  
      const emptySet = LL1Parser["computeTokensThatDeriveEmptyStringSet"](grammar);
      const firstSets = LL1Parser["computeFirstSets"](grammar, emptySet);
      const followSets = LL1Parser["computeFollowSets"](grammar, emptySet, firstSets);
      const parseTable = LL1Parser["computeParseTable"](grammar, emptySet, firstSets, followSets);
      
      expect(parseTable["S"]["a"].map(alternative => alternative.toString())).toStrictEqual(["A", "a A", "A B C"]);
      expect(parseTable["S"]["b"].map(alternative => alternative.toString())).toStrictEqual(["A", "A B C"]);
      expect(parseTable["S"]["c"].map(alternative => alternative.toString())).toStrictEqual(["A B C"]);

      expect(parseTable["A"]["a"].map(alternative => alternative.toString())).toStrictEqual(["a a a"]);
      expect(parseTable["A"]["b"].map(alternative => alternative.toString())).toStrictEqual(["b", "B B"]);
      expect(parseTable["A"]["c"].map(alternative => alternative.toString())).toStrictEqual([]);

      expect(parseTable["B"]["a"].map(alternative => alternative.toString())).toStrictEqual([]);
      expect(parseTable["B"]["b"].map(alternative => alternative.toString())).toStrictEqual(["b b", ""]);
      expect(parseTable["B"]["c"].map(alternative => alternative.toString())).toStrictEqual([""]);

      expect(parseTable["C"]["a"].map(alternative => alternative.toString())).toStrictEqual([]);
      expect(parseTable["C"]["b"].map(alternative => alternative.toString())).toStrictEqual(["B"]);
      expect(parseTable["C"]["c"].map(alternative => alternative.toString())).toStrictEqual(["c"]);

    });
  });
});