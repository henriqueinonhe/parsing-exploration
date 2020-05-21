import { Grammar } from "../src/Grammar";
import { Token } from "../src/Token";
import { ProductionRule } from "../src/ProductionRule";
import { TokenSort } from "../src/TokenTable";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Non terminals list cannot be empty", () =>
    {
      const nonTerminals = [] as Array<Token>;
      const terminals = [new Token("A")];
      const rules = [] as Array<ProductionRule>;
      const startSymbol = new Token("A");
      expect(() => {new Grammar(nonTerminals, terminals, rules, startSymbol);}).toThrow("Non terminals list is empty!");
    });

    test("Terminals list cannot be empty", () =>
    {
      const nonTerminals = [new Token("A")];
      const terminals = [] as Array<Token>;
      const rules = [] as Array<ProductionRule>;
      const startSymbol = new Token("A");
      expect(() => {new Grammar(nonTerminals, terminals, rules, startSymbol);}).toThrow("Terminals list is empty!");
    });

    test("Terminals and non terminals must be disjunct", () =>
    {
      expect(() => {Grammar.constructFromStrings(["A", "B", "C"], ["a", "B", "c"], [], "A");}).toThrow(`Tokens "B" appear both as terminals and non terminals!`);
      expect(() => {Grammar.constructFromStrings(["A", "B", "C"], ["A", "b", "C"], [], "A");}).toThrow(`Tokens "A", "C" appear both as terminals and non terminals!`);
    });

    test("Every token that occurs in production rules must also be present in the token table", () =>
    {
      const nonTerminals = ["<expr>", "<prim>", "<comp>"];
      const terminals = ["i", "o", "->"];
      const rules = [
        {lhs: "<expr>", rhs: ["<prim>", "<comp>"]},
        {lhs: "<prim>", rhs: ["i", "o"]},
        {lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"]},
        {lhs: "<prod>", rhs: ["[ <expr> <more> ]"]},
        {lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"]}
      ];
      const startSymbol = "<expr>";
      expect(() => {Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol);}).toThrow(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "(", ")", "<prod>", "[", "<more>", "]", ","!`);
    });

    test("Start symbol must be present in the token table", () =>
    {
      const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
      const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
      const rules = [
        {lhs: "<expr>", rhs: ["<prim>", "<comp>"]},
        {lhs: "<prim>", rhs: ["i", "o"]},
        {lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"]},
        {lhs: "<prod>", rhs: ["[ <expr> <more> ]"]},
        {lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"]}
      ];
      const startSymbol = "<COMP>";
      expect(() => {Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol);}).toThrow(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
    });
  });

  describe("Post Conditions", () =>
  {
    test("Token table registers every token correctly", () =>
    {
      const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
      const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
      const rules = [
        {lhs: "<expr>", rhs: ["<prim>", "<comp>"]},
        {lhs: "<prim>", rhs: ["i", "o"]},
        {lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"]},
        {lhs: "<prod>", rhs: ["[ <expr> <more> ]"]},
        {lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"]}
      ];
      const startSymbol = "<expr>";
      const tokenTable = Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol).getTokenTable();

      for(const nonTerminal of nonTerminals)
      {
        expect(tokenTable[nonTerminal]).toBe(TokenSort.NonTerminal);
      }

      for(const terminal of terminals)
      {
        expect(tokenTable[terminal]).toBe(TokenSort.Terminal);
      }
    });

    test("Rules are correctly merged", () =>
    {
      const nonTerminals = ["S"];
      const terminals = ["a"];
      const rules = [
        {lhs: "S", rhs: ["a"]},
        {lhs: "S", rhs: ["a S"]}
      ];
      const startSymbol = "S";
      expect(Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol).getRules().map(rule => {return {lhs: rule.getLhs().toString(), rhs : rule.getRhs().map(elem => elem.toString())};})).toStrictEqual([{lhs: "S", rhs: ["a S", "a"]}]);
    });
  });
}); 