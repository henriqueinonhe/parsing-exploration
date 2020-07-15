import { Grammar } from "../src/Core/Grammar";
import { RegularLanguageConverter, RegularLanguageConverterGrammarDirection } from "../src/Transformers/RegularLanguageConverter";
import { FiniteStateAutomaton } from "../src/Automata/FiniteStateAutomaton";

describe("grammarToNFA()", () =>
{
  describe("Pre Conditions", () =>
  {
    //TODO
  });

  describe("Post Conditions", () =>
  {
    test("Right regular", () =>
    {
      //Equivalent to -> (ab*c)*|d
      const nonTerminals = ["S", "A", "B"];
      const terminals = ["a", "b", "c", "d"];
      const rules = [
        {lhs: "S", rhs: ["", "a A", "d"]},
        {lhs: "A", rhs: ["b A", "B"]},
        {lhs: "B", rhs: ["c S", "c"]}
      ];
      const startSymbol = "S";
      const grammar = Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
      const nfa = RegularLanguageConverter.grammarToNFA(grammar);

      expect(nfa.getStates()).toStrictEqual([`"ACCEPT"`, ...nonTerminals]);
      expect(nfa.getTransitions()).toStrictEqual([
        {currentState: "S", condition: "", nextState: `"ACCEPT"`},
        {currentState: "S", condition: "a", nextState: `A`},
        {currentState: "S", condition: "d", nextState: `"ACCEPT"`},
        {currentState: "A", condition: "b", nextState: `A`},
        {currentState: "A", condition: "", nextState: `B`},
        {currentState: "B", condition: "c", nextState: `S`},
        {currentState: "B", condition: "c", nextState: `"ACCEPT"`}
      ]);
      expect(nfa.getInitialState()).toBe("S");
      expect(nfa.getAcceptState()).toBe(`"ACCEPT"`);

      expect(nfa.accepts([""])).toBe(true);
      expect(nfa.accepts("a c".split(" "))).toBe(true);
      expect(nfa.accepts("a b c".split(" "))).toBe(true);
      expect(nfa.accepts("a b b c".split(" "))).toBe(true);
      expect(nfa.accepts("a b b b c a b b b c".split(" "))).toBe(true);
      expect(nfa.accepts("a b c a b b c".split(" "))).toBe(true);
      expect(nfa.accepts("a c a c a c".split(" "))).toBe(true);
      expect(nfa.accepts("d".split(" "))).toBe(true);

      expect(nfa.accepts("a".split(" "))).toBe(false);
      expect(nfa.accepts("c".split(" "))).toBe(false);
      expect(nfa.accepts("b".split(" "))).toBe(false);
      expect(nfa.accepts("a a b c".split(" "))).toBe(false);
      expect(nfa.accepts("e".split(" "))).toBe(false);
    });
  });
});

describe("NFAToGrammar()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Right regular", () =>
    {
      const states = ["S", "A", "B", `ACCEPT`];
      const transitions = [
        {currentState: "S", condition: "", nextState: `ACCEPT`},
        {currentState: "S", condition: "a", nextState: `A`},
        {currentState: "S", condition: "d", nextState: `ACCEPT`},
        {currentState: "A", condition: "b", nextState: `A`},
        {currentState: "A", condition: "", nextState: `B`},
        {currentState: "B", condition: "c", nextState: `S`},
        {currentState: "B", condition: "c", nextState: `ACCEPT`}
      ];
      const initialState = "S";
      const acceptState = `ACCEPT`;
      const nfa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      const grammar = RegularLanguageConverter.NFAToGrammar(nfa, RegularLanguageConverterGrammarDirection.Right);

      expect(grammar.getStartSymbol().toString()).toBe(nfa.getInitialState());
      expect(grammar.listNonTerminals().map(token => token.toString())).toStrictEqual(states);
      expect(grammar.listTerminals().map(token => token.toString())).toStrictEqual(["a", "d", "b", "c"]);
      expect(grammar.getRules().map(rule => rule.toString())).toStrictEqual([
        `"S" -> "d" | "a A" | ""`,
        `"A" -> "B" | "b A"`,
        `"B" -> "c" | "c S"`
      ]);

    });
  });
});