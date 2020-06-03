import { Grammar } from "../src/Grammar";
import { CYKRecognizer } from "../src/CYKRecognizer";
import { TokenString } from "../src/TokenString";

const nonTerminals = ["Number", "Integer", "Real", "Fraction", "Scale", "Digit", "Sign", "Empty"];
const terminals = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "e"];
const rules = [
  {lhs: "Number", rhs: ["Integer", "Real"]},
  {lhs: "Integer", rhs: ["Digit", "Integer Digit"]},
  {lhs: "Real", rhs: ["Integer Fraction Scale"]},
  {lhs: "Fraction", rhs: [". Integer"]},
  {lhs: "Scale", rhs: ["e Sign Integer", "Empty"]},
  {lhs: "Digit", rhs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]},
  {lhs: "Sign", rhs: ["+", "-"]},
  {lhs: "Empty", rhs: [""]}
];
const startSymbol = "Number";
const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
const recognizer = new CYKRecognizer(grammar);

recognizer.buildTable(TokenString.fromString("3 2 . 5 e + 1"));

test("", () =>
{

});