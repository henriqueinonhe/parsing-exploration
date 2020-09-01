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

// const nonTerminals = [
//   "Expressions",
//   "Expression",
//   "Whitespace",
//   "ExpressionKernel",
//   "FunctionApplication",
//   "ArgumentLists",
//   "ArgumentList",
//   "Arguments",
//   "BracketedExpression",
//   "PrimitiveExpression",
//   "FunctionalSymbol"
// ];
// const terminals = [
//   "a",
//   "b",
//   "c",
//   "d",
//   "e",
//   "f",
//   "g",
//   "h",
//   ",",
//   "(",
//   ")",
//   "_"
// ];
// const rules = [
//   {lhs: "Expressions", rhs: ["Expression", "Expression Expressions"]},
//   {lhs: "Expression", rhs: ["Whitespace ExpressionKernel Whitespace"]},
//   {lhs: "Whitespace", rhs: ["_ Whitespace", ""]},
//   {lhs: "ExpressionKernel", rhs: ["FunctionApplication", "BracketedExpression", "PrimitiveExpression"]},
//   {lhs: "FunctionApplication", rhs: ["FunctionalSymbol ArgumentLists"]},
//   {lhs: "ArgumentLists", rhs: ["( Arguments )"]},
//   {lhs: "Arguments", rhs: ["Expressions , Arguments", "Expressions"]},
//   {lhs: "BracketedExpression", rhs: ["( Expressions )"]},
//   {lhs: "PrimitiveExpression", rhs: ["a", "b", "c", "d", "e", "f", "g", "h"]},
//   {lhs: "FunctionalSymbol", rhs: ["f", "g", "h"]}
// ];
// const startSymbol = "Expressions";
// const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
// const parser = new NoLookaheadLRParser(grammar);
// const trees = parser.parse(TokenString.fromString("( a )")).map(tree => tree.getRoot().serialize());
// console.log(JSON.stringify(trees));

test("", () =>{});