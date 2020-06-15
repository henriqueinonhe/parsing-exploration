import { Grammar } from "../src/Core/Grammar";
import { SentenceGenerator } from "../src/Generators/SentenceGenerator";

describe("generate()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Grammar 1", () =>
    {
      const nonTerminals = ["S", "Q"];
      const terminals = ["a", "b", "c"];
      const rules = [
        {lhs: "S", rhs: ["a b c", "a S Q"]},
        {lhs: "b Q c", rhs: ["b b c c"]},
        {lhs: "c Q", rhs: ["Q c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const generator = new SentenceGenerator(grammar);

      expect(generator.generate(1).map(sentence => sentence.toString())).toStrictEqual(["a b c"]);
      expect(generator.generate(2).map(sentence => sentence.toString())).toStrictEqual(["a b c", "a a b b c c"]);
      expect(generator.generate(3).map(sentence => sentence.toString())).toStrictEqual(["a b c", "a a b b c c", "a a a b b b c c c"]);
    });
  });
});