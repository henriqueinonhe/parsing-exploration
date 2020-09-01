import { Grammar } from "../src/Core/Grammar";
import { CYKParser } from "../src/Parsers/CYKParser";
import { TokenString } from "../src/Core/TokenString";

// const nonTerminals = ["S", "A", "B", "C"];
// const terminals = ["a", "b", "c"];
// const rules = [
//   {lhs: "S", rhs: ["A", "A B", "C", "a", "b", "c"]},
//   {lhs: "A", rhs: ["a A", ""]},
//   {lhs: "B", rhs: ["B"]},
//   {lhs: "C", rhs: ["a C", "c", "A"]}
// ];

// const startSymbol = "S";
// const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
// const parser = new CYKParser(grammar);
// parser.parse(TokenString.fromString("a"));

const nonTerminals = [
  "Expressions",
  "Expression",
  "Whitespace",
  "ExpressionKernel",
  "FunctionApplication",
  "ArgumentLists",
  "ArgumentList",
  "Arguments",
  "BracketedExpression",
  "PrimitiveExpression",
  "FunctionalSymbol"
];
const terminals = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  ",",
  "(",
  ")",
  "_"
];
const rules = [
  {lhs: "Expressions", rhs: ["Expression", "Expression Expressions"]},
  {lhs: "Expression", rhs: ["Whitespace ExpressionKernel Whitespace"]},
  {lhs: "Whitespace", rhs: ["_ Whitespace", ""]},
  {lhs: "ExpressionKernel", rhs: ["FunctionApplication", "BracketedExpression", "PrimitiveExpression"]},
  {lhs: "FunctionApplication", rhs: ["FunctionalSymbol ArgumentLists"]},
  {lhs: "ArgumentLists", rhs: ["( Arguments )"]},
  {lhs: "Arguments", rhs: ["Expressions , Arguments", "Expressions"]},
  {lhs: "BracketedExpression", rhs: ["( Expressions )"]},
  {lhs: "PrimitiveExpression", rhs: ["a", "b", "c", "d", "e", "f", "g", "h"]},
  {lhs: "FunctionalSymbol", rhs: ["f", "g", "h"]}
];
const startSymbol = "Expressions";
const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
const parser = new CYKParser(grammar);
const trees = parser.parse(TokenString.fromString("f ( _ a _ )")).map(tree => tree.root.serialize());
console.log(JSON.stringify(trees));


describe("parse()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>{});
  });
});