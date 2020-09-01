import { Grammar } from "../src/Core/Grammar";
import { NoLookaheadLLParser } from "../src/Parsers/NoLookaheadLLParser";
import { TokenString } from "../src/Core/TokenString";

// const nonTerminals = ["S", "A", "B"];
//     const terminals = ["a", "b"];
//     const rules = [
//       {lhs: "S", rhs: ["a B", "b A"]},
//       {lhs: "A", rhs: ["a", "a S", "b A A"]},
//       {lhs: "B", rhs: ["b", "b S", "a B B"]}
//     ];
//     const startSymbol = "S";
//     const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
//     const parser = new NoLookaheadLLParser(grammar);
//     parser.parse(TokenString.fromString("a a b b"));

    //Specific Grammar
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
    {lhs: "Arguments", rhs: ["Expression , Arguments", "Expression"]},
    {lhs: "BracketedExpression", rhs: ["( Expression )"]},
    {lhs: "PrimitiveExpression", rhs: ["a", "b", "c", "d", "e"]},
    {lhs: "FunctionalSymbol", rhs: ["f", "g", "h"]}
  ];
  const startSymbol = "Expressions";
  const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
  const parser = new NoLookaheadLLParser(grammar);
  const trees = parser.parse(TokenString.fromString("f")).map(tree => tree.getRoot().serialize());

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