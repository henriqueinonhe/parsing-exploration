import { Grammar } from "../src/Grammar";
import { ContextFreeGrammarAnalyzer } from "../src/ContextFreeGrammarAnalyzer";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Grammar analyzed must be context free", () =>
    {
      //TODO
    });
  });
});

describe("Adjacency matrix", () =>
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
    const grammar = Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol);
    const analyzer = new ContextFreeGrammarAnalyzer(grammar);
    const adjacencyMatrix = analyzer.getTokenAdjacencyMatrix();

    expect(adjacencyMatrix["<expr>"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["<prim>"]).toBe(true);
    expect(adjacencyMatrix["<expr>"]["<comp>"]).toBe(true);
    expect(adjacencyMatrix["<expr>"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["["]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<expr>"]["("]).toBe(false);
    expect(adjacencyMatrix["<expr>"][")"]).toBe(false);
    expect(adjacencyMatrix["<expr>"][","]).toBe(false);

    expect(adjacencyMatrix["<prim>"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["i"]).toBe(true);
    expect(adjacencyMatrix["<prim>"]["o"]).toBe(true);
    expect(adjacencyMatrix["<prim>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["["]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<prim>"]["("]).toBe(false);
    expect(adjacencyMatrix["<prim>"][")"]).toBe(false);
    expect(adjacencyMatrix["<prim>"][","]).toBe(false);

    expect(adjacencyMatrix["<comp>"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["<prim>"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["<comp>"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["<prod>"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["->"]).toBe(true);
    expect(adjacencyMatrix["<comp>"]["["]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<comp>"]["("]).toBe(true);
    expect(adjacencyMatrix["<comp>"][")"]).toBe(true);
    expect(adjacencyMatrix["<comp>"][","]).toBe(false);

    expect(adjacencyMatrix["<more>"]["<expr>"]).toBe(true);
    expect(adjacencyMatrix["<more>"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["<more>"]).toBe(true);
    expect(adjacencyMatrix["<more>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["["]).toBe(false);
    expect(adjacencyMatrix["<more>"]["]"]).toBe(false);
    expect(adjacencyMatrix["<more>"]["("]).toBe(false);
    expect(adjacencyMatrix["<more>"][")"]).toBe(false);
    expect(adjacencyMatrix["<more>"][","]).toBe(true);

    expect(adjacencyMatrix["<prod>"]["<expr>"]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["<more>"]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["i"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["o"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["->"]).toBe(false);
    expect(adjacencyMatrix["<prod>"]["["]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["]"]).toBe(true);
    expect(adjacencyMatrix["<prod>"]["("]).toBe(false);
    expect(adjacencyMatrix["<prod>"][")"]).toBe(false);
    expect(adjacencyMatrix["<prod>"][","]).toBe(false);

    expect(adjacencyMatrix["i"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["i"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["i"]["i"]).toBe(false);
    expect(adjacencyMatrix["i"]["o"]).toBe(false);
    expect(adjacencyMatrix["i"]["->"]).toBe(false);
    expect(adjacencyMatrix["i"]["["]).toBe(false);
    expect(adjacencyMatrix["i"]["]"]).toBe(false);
    expect(adjacencyMatrix["i"]["("]).toBe(false);
    expect(adjacencyMatrix["i"][")"]).toBe(false);
    expect(adjacencyMatrix["i"][","]).toBe(false);

    expect(adjacencyMatrix["o"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["o"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["o"]["i"]).toBe(false);
    expect(adjacencyMatrix["o"]["o"]).toBe(false);
    expect(adjacencyMatrix["o"]["->"]).toBe(false);
    expect(adjacencyMatrix["o"]["["]).toBe(false);
    expect(adjacencyMatrix["o"]["]"]).toBe(false);
    expect(adjacencyMatrix["o"]["("]).toBe(false);
    expect(adjacencyMatrix["o"][")"]).toBe(false);
    expect(adjacencyMatrix["o"][","]).toBe(false);

    expect(adjacencyMatrix[","]["<expr>"]).toBe(false);
    expect(adjacencyMatrix[","]["<prim>"]).toBe(false);
    expect(adjacencyMatrix[","]["<comp>"]).toBe(false);
    expect(adjacencyMatrix[","]["<more>"]).toBe(false);
    expect(adjacencyMatrix[","]["<prod>"]).toBe(false);
    expect(adjacencyMatrix[","]["i"]).toBe(false);
    expect(adjacencyMatrix[","]["o"]).toBe(false);
    expect(adjacencyMatrix[","]["->"]).toBe(false);
    expect(adjacencyMatrix[","]["["]).toBe(false);
    expect(adjacencyMatrix[","]["]"]).toBe(false);
    expect(adjacencyMatrix[","]["("]).toBe(false);
    expect(adjacencyMatrix[","][")"]).toBe(false);
    expect(adjacencyMatrix[","][","]).toBe(false);

    expect(adjacencyMatrix["->"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["->"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["->"]["i"]).toBe(false);
    expect(adjacencyMatrix["->"]["o"]).toBe(false);
    expect(adjacencyMatrix["->"]["->"]).toBe(false);
    expect(adjacencyMatrix["->"]["["]).toBe(false);
    expect(adjacencyMatrix["->"]["]"]).toBe(false);
    expect(adjacencyMatrix["->"]["("]).toBe(false);
    expect(adjacencyMatrix["->"][")"]).toBe(false);
    expect(adjacencyMatrix["->"][","]).toBe(false);

    expect(adjacencyMatrix["["]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["["]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["["]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["["]["<more>"]).toBe(false);
    expect(adjacencyMatrix["["]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["["]["i"]).toBe(false);
    expect(adjacencyMatrix["["]["o"]).toBe(false);
    expect(adjacencyMatrix["["]["->"]).toBe(false);
    expect(adjacencyMatrix["["]["["]).toBe(false);
    expect(adjacencyMatrix["["]["]"]).toBe(false);
    expect(adjacencyMatrix["["]["("]).toBe(false);
    expect(adjacencyMatrix["["][")"]).toBe(false);
    expect(adjacencyMatrix["["][","]).toBe(false);

    expect(adjacencyMatrix["]"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<more>"]).toBe(false);
    expect(adjacencyMatrix["]"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["]"]["i"]).toBe(false);
    expect(adjacencyMatrix["]"]["o"]).toBe(false);
    expect(adjacencyMatrix["]"]["->"]).toBe(false);
    expect(adjacencyMatrix["]"]["["]).toBe(false);
    expect(adjacencyMatrix["]"]["]"]).toBe(false);
    expect(adjacencyMatrix["]"]["("]).toBe(false);
    expect(adjacencyMatrix["]"][")"]).toBe(false);
    expect(adjacencyMatrix["]"][","]).toBe(false);

    expect(adjacencyMatrix["("]["<expr>"]).toBe(false);
    expect(adjacencyMatrix["("]["<prim>"]).toBe(false);
    expect(adjacencyMatrix["("]["<comp>"]).toBe(false);
    expect(adjacencyMatrix["("]["<more>"]).toBe(false);
    expect(adjacencyMatrix["("]["<prod>"]).toBe(false);
    expect(adjacencyMatrix["("]["i"]).toBe(false);
    expect(adjacencyMatrix["("]["o"]).toBe(false);
    expect(adjacencyMatrix["("]["->"]).toBe(false);
    expect(adjacencyMatrix["("]["["]).toBe(false);
    expect(adjacencyMatrix["("]["]"]).toBe(false);
    expect(adjacencyMatrix["("]["("]).toBe(false);
    expect(adjacencyMatrix["("][")"]).toBe(false);
    expect(adjacencyMatrix["("][","]).toBe(false);

    expect(adjacencyMatrix[")"]["<expr>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<prim>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<comp>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<more>"]).toBe(false);
    expect(adjacencyMatrix[")"]["<prod>"]).toBe(false);
    expect(adjacencyMatrix[")"]["i"]).toBe(false);
    expect(adjacencyMatrix[")"]["o"]).toBe(false);
    expect(adjacencyMatrix[")"]["->"]).toBe(false);
    expect(adjacencyMatrix[")"]["["]).toBe(false);
    expect(adjacencyMatrix[")"]["]"]).toBe(false);
    expect(adjacencyMatrix[")"]["("]).toBe(false);
    expect(adjacencyMatrix[")"][")"]).toBe(false);
    expect(adjacencyMatrix[")"][","]).toBe(false);
  });
});