import { Grammar } from "../src/Core/Grammar";
import { TokenSort } from "../src/Core/TokenSortTable";
import { TokenString } from "../src/Core/TokenString";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Terminals and non terminals must be disjunct", () =>
    {
      expect(() => {Grammar.fromStrings(["A", "B", "C"], ["a", "B", "c"], [], "A");}).toThrow(`Tokens "B" appear both as terminals and non terminals!`);
      expect(() => {Grammar.fromStrings(["A", "B", "C"], ["A", "b", "C"], [], "A");}).toThrow(`Tokens "A", "C" appear both as terminals and non terminals!`);
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
      expect(() => {Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);}).toThrow(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "(", ")", "<prod>", "[", "<more>", "]", ","!`);
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
      expect(() => {Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);}).toThrow(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
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
      const tokenTable = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getTokenSortTable();

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
      expect(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getRules().map(rule => {return {lhs: rule.getLhs().toString(), rhs : rule.getRhs().map(elem => elem.toString())};})).toStrictEqual([{lhs: "S", rhs: ["a S", "a"]}]);
    });
  });
}); 

describe("isRightRegular()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B"];
      const terminals = ["a", "b"];
      const rules = [
        {lhs: "S", rhs: ["a S", "a", "A"]},
        {lhs: "A", rhs: ["b A", "B"]},
        {lhs: "B", rhs: ["b"]}
      ];
      const startSymbol = "S";
      expect(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).isRightRegular()).toBe(true);

      const rules2 =  [
        {lhs: "S", rhs: ["a S", "a", "A S"]}, //-> This line is different
        {lhs: "A", rhs: ["b A", "B"]},
        {lhs: "B", rhs: ["b"]}
      ];
      expect(Grammar.fromStrings(nonTerminals, terminals, rules2, startSymbol).isRightRegular()).toBe(false);
    });
  });
});

describe("queryRule()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B"];
      const terminals = ["a", "b"];
      const rules = [
        {lhs: "S", rhs: ["a S", "a", "A"]},
        {lhs: "A", rhs: ["b A", "B"]},
        {lhs: "S B", rhs: ["b"]}
      ];
      const startSymbol = "S";
      expect(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).queryRule(TokenString.fromString("S B"))?.getRhs()[0].toString()).toBe("b");
    });
  });
});

describe("hasChomskyNormalForm()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules1 = [
        {lhs: "S", rhs: ["A A", "S A", "a", ""]},
        {lhs: "A", rhs: ["A B", "a"]},
        {lhs: "B", rhs: ["b", "B C"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const startSymbol = "S";
      expect(Grammar.fromStrings(nonTerminals, terminals, rules1, startSymbol).hasChomskyNormalForm()).toBe(true);

      const rules2 = [
        {lhs: "S", rhs: ["A A", "S A", "a"]},
        {lhs: "A", rhs: ["A B", "a", ""]}, //-> Empty String associated with a non terminal that is not the start symbol
        {lhs: "B", rhs: ["b", "B C"]},
        {lhs: "C", rhs: ["c"]}
      ];

      expect(Grammar.fromStrings(nonTerminals, terminals, rules2, startSymbol).hasChomskyNormalForm()).toBe(false);
    });
  });
});

describe("getStartingRule()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Happy Path", () =>
    {
      const nonTerminals = ["S", "A", "B"];
      const terminals = ["a", "b"];
      const rules = [
        {lhs: "S", rhs: ["a S", "a", "A"]},
        {lhs: "A", rhs: ["b A", "B"]},
        {lhs: "S B", rhs: ["b"]}
      ];
      const startSymbol = "S";
      expect(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getStartingRule()?.getLhs().toString()).toBe("S");
    });

    test("No starting rule", () =>
    {
      const nonTerminals = ["S", "A", "B"];
      const terminals = ["a", "b"];
      const rules = [
        {lhs: "A", rhs: ["b A", "B"]},
        {lhs: "S B", rhs: ["b"]}
      ];
      const startSymbol = "S";
      expect(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getStartingRule()?.getLhs().toString()).toBe(undefined);
    });
  });
});

describe("isEqual()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A A", "S A", "a", ""]},
        {lhs: "A", rhs: ["A B", "a"]},
        {lhs: "B", rhs: ["b", "B C"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const startSymbol = "S";
      expect(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).isEqual(Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol)));
    });
  });
});

describe("clone()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Cloned correctly", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A A", "S A", "a", ""]},
        {lhs: "A", rhs: ["A B", "a"]},
        {lhs: "B", rhs: ["b", "B C"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const startSymbol = "S";

      const original = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const clone = original.clone();

      expect(original.isEqual(clone));
      expect(clone.isEqual(original));
    });

    test("Modifying clone doesn't affect original", () =>
    {
      const nonTerminals = ["S", "A", "B", "C"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["A A", "S A", "a", ""]},
        {lhs: "A", rhs: ["A B", "a"]},
        {lhs: "B", rhs: ["b", "B C"]},
        {lhs: "C", rhs: ["c"]}
      ];
      const startSymbol = "S";

      const original = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const clone = original.clone();

      clone.getTokenSortTable()["S"] = TokenSort.Terminal;
      expect(original.getTokenSortTable()["S"]).toBe(TokenSort.NonTerminal);
    });
  });
});

describe("listTerminals()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
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
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);

      expect(grammar.listTerminals().map(token => token.toString())).toStrictEqual(terminals);
    });
  });
});

describe("listNonTerminals()", () => 
{
  describe("Post Conditions", () =>
  {
    test("", () =>
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
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);

      expect(grammar.listNonTerminals().map(token => token.toString())).toStrictEqual(nonTerminals);
    });
  });
});