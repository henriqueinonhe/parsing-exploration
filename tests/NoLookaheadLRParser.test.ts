import { Grammar } from "../src/Core/Grammar";
import { NoLookaheadLRParser } from "../src/Parsers/NoLookaheadLRParser";
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
const parser = new NoLookaheadLRParser(grammar);
parser.parse(TokenString.fromString("a a b b"));

test("", () =>{});