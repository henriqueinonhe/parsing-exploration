import { Grammar } from "../src/Core/Grammar";
import { NoLookaheadLLParser } from "../src/Parsers/NoLookaheadLLParser";
import { TokenString } from "../src/Core/TokenString";

const nonTerminals = ["S", "A", "B"];
    const terminals = ["a", "b"];
    const rules = [
      {lhs: "S", rhs: ["a B", "b A"]},
      {lhs: "A", rhs: ["a", "a S", "b A A"]},
      {lhs: "B", rhs: ["b", "b S", "a B B"]}
    ];
    const startSymbol = "S";
    const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
    const parser = new NoLookaheadLLParser(grammar);
    parser.parse(TokenString.fromString("a a b b"));

describe("parse", () =>
{
  describe("Post Conditions", () =>
  {
    const nonTerminals = ["S", "A", "B"];
    const terminals = ["a", "b"];
    const rules = [
      {lhs: "S", rhs: ["a B", "b A"]},
      {lhs: "A", rhs: ["a", "a S", "b A A"]},
      {lhs: "B", rhs: ["b", "b S", "a B B"]}
    ];
    const startSymbol = "S";
    const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
    const parser = new NoLookaheadLLParser(grammar);

  });
});

test("", () =>{});