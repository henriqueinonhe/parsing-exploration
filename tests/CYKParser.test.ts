import { Grammar } from "../src/Core/Grammar";
import { CYKParser } from "../src/Parsers/CYKParser";
import { TokenString } from "../src/Core/TokenString";

const nonTerminals = ["S", "A", "B", "C"];
const terminals = ["a", "b", "c"];
const rules = [
  {lhs: "S", rhs: ["A", "A B", "C", "a", "b", "c"]},
  {lhs: "A", rhs: ["a A", ""]},
  {lhs: "B", rhs: ["B"]},
  {lhs: "C", rhs: ["a C", "c", "A"]}
];

const startSymbol = "S";
const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
const parser = new CYKParser(grammar);
parser.parse(TokenString.fromString("a"));

describe("parse()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>{});
  });
});