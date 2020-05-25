import { Grammar } from "../src/Grammar";
import { UngersEFreeRecognizer } from "../src/UngersEFreeRecognizer";
import { TokenString } from "../src/TokenString";

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
      const grammar = Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol);
      const recognizer = new UngersEFreeRecognizer(grammar);

      expect(recognizer.recognizes(TokenString.fromString("0"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( 7 + 4 )"))).toBe(true);
      expect(recognizer.recognizes(TokenString.fromString("( ( 3 + 4 ) *  5 )"))).toBe(true);

      expect(recognizer.recognizes(TokenString.fromString("d"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("( 7  4 )"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("( ( 3 + 4 ) *  5 ) )"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("2 + 3"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("2 4 5"))).toBe(false);
      expect(recognizer.recognizes(TokenString.fromString("5 * 0"))).toBe(false);
    });
  });
}); 