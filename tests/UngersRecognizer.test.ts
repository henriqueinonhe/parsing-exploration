import { Grammar } from "../src/Core/Grammar";
import { UngersRecognizer } from "../src/Recognizers/UngersRecognizer";
import { TokenString } from "../src/Core/TokenString";

describe("recgonizes()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const nonTerminals = ["<expr>", "<digit>"];
      const terminals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "*", "(", ")"];
      const rules = [
        {lhs: "<expr>", rhs: ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"]},
        {lhs: "<digit>", rhs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]}
      ];
      const startSymbol = "<expr>";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const recognizer = new UngersRecognizer(grammar);

      expect(recognizer.recognizes(TokenString.fromString("0"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( 7 + 4 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( 3 + 4 ) *  5 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( 9 + 9 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( 9 + 9 ) + 9 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( ( 9 + 9 ) + 9 ) + 9 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 ) + 9 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( ( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( ( ( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 )"))).toBe(true);
      //expect(recognizer.recognizes(TokenString.fromString("( ( ( ( ( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 )"))).toBe(true);
      //expect(recognizer.recognizes(TokenString.fromString("( ( ( ( ( ( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 )"))).toBe(true);

      expect(recognizer.recognizes(TokenString.fromString("d"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("( 7  4 )"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("( ( 3 + 4 ) *  5 ) )"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("2 + 3"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("2 4 5"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("5 * 0"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("( ( ( ( ( ( ( ( ( 9 + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) + 9 ) ."))).toBe(false);
    });

    test("", () =>
    {
      const nonTerminals = ["<expr>", "<digit>"];
      const terminals = ["0", "1", "+"];
      const rules = [
        {lhs: "<expr>", rhs: ["<expr> + <expr>", "<digit>"]},
        {lhs: "<digit>", rhs: ["0", "1"]}
      ];
      const startSymbol = "<expr>";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const recognizer = new UngersRecognizer(grammar);

      expect(recognizer.recognizes(TokenString.fromString("1 + 1"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("1 + 1 + 0"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("1 + 0 + 0"))).toBe(true);
    });

    test("Cyclic Grammar", () =>
    {
      const nonTerminals = ["S", "A"];
      const terminals = ["a"];
      const rules = [
        {lhs: "S", rhs: ["S", "A a", "a"]},
        {lhs: "A", rhs: ["S"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const recognizer = new UngersRecognizer(grammar);

      expect(recognizer.recognizes(TokenString.fromString("a a"))).toBe(true); 
      expect(recognizer.recognizes(TokenString.fromString("a a a a a a a a"))).toBe(true);
    });

    test("Grammar With E Rules", () =>
    {
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
      const recognizer = new UngersRecognizer(grammar);

      expect(recognizer.recognizes(TokenString.fromString("3 2 . 5 e + 1"))).toBe(true);

      expect(recognizer.recognizes(TokenString.fromString(". 5 e + 1"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString(""))).toBe(false);
    });
  });
}); 