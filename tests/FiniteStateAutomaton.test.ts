import { FiniteStateAutomaton } from "../src/Automata/FiniteStateAutomaton";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Initial state is not in states", () =>
    {
      const initialState = "S";
      const states = ["A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(() => {new FiniteStateAutomaton(initialState, states, transitions, acceptState);}).toThrow("Initial state");
    });

    test("Accept state not in states", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(() => {new FiniteStateAutomaton(initialState, states, transitions, acceptState);}).toThrow("Accept state");
    });

    test("Transition state not in states", () =>
    {
      {
        const initialState = "S";
        const states = ["S", "A", "B", "C", "ACCEPT"];
        const transitions = [
          {currentState: "S", condition: "a", nextState: "A"},
          {currentState: "S", condition: "b", nextState: "B"},
          {currentState: "S", condition: "c", nextState: "C"},
          {currentState: "D", condition: "a", nextState: "ACCEPT"}
        ];
        const acceptState = "ACCEPT";
        expect(() => {new FiniteStateAutomaton(initialState, states, transitions, acceptState);}).toThrow("A transition");
      }

      {
        const initialState = "S";
        const states = ["S", "A", "B", "C", "ACCEPT"];
        const transitions = [
          {currentState: "S", condition: "a", nextState: "A"},
          {currentState: "S", condition: "b", nextState: "B"},
          {currentState: "S", condition: "c", nextState: "C"},
          {currentState: "ACCEPT", condition: "a", nextState: "D"}
        ];
        const acceptState = "ACCEPT";
        expect(() => {new FiniteStateAutomaton(initialState, states, transitions, acceptState);}).toThrow("A transition");
      }
    });
  });

  describe("Post Conditions", () =>
  {
    test("No duplicates in states", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "C", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(new FiniteStateAutomaton(initialState, states, transitions, acceptState).getStates()).toStrictEqual(["S", "A", "B", "C", "ACCEPT"]);
    });
    
    test("No duplicates in transitions", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(new FiniteStateAutomaton(initialState, states, transitions, acceptState).getTransitions()).toStrictEqual([
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}]);
    });

    test("Starts as not running", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(new FiniteStateAutomaton(initialState, states, transitions, acceptState).isRunning()).toBe(false);
    });

    test("Starts as finished (Empty input)", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(new FiniteStateAutomaton(initialState, states, transitions, acceptState).hasFinished()).toBe(true);
    });

    test("No finished threads", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      expect(new FiniteStateAutomaton(initialState, states, transitions, acceptState).getLivingThreads()).toStrictEqual([]);
    });

    test("Starting living thread", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      expect(fsa.getFinishedThreads().length).toBe(1);
      expect(fsa.getFinishedThreads()[0].getLog()).toStrictEqual(["S"]);
    });
  });
});

describe("setInput()", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Cannot set input while machine is still running", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a b c".split(" "));
      fsa.compute(1);
      expect(() => {fsa.setInput(["a"]);}).toThrow("Cannot set input as machine is still running!");
    });
  });

  describe("Post Conditions", () =>
  {
    test("Non empty input", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a b c".split(" "));
      expect(fsa.getInput()).toStrictEqual(["a", "b", "c"]);
    });

    test("Empty input", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "C", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "S", condition: "b", nextState: "B"},
        {currentState: "S", condition: "c", nextState: "C"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput([]);
      expect(fsa.isRunning()).toBe(false);
      expect(fsa.hasFinished()).toBe(true);
    });
  });
});

describe("compute()", () =>
{
  describe("Pre Conditions", () =>
  {
    const initialState = "S";
    const states = ["S", "A", "B", "C", "ACCEPT"];
    const transitions = [
      {currentState: "S", condition: "a", nextState: "A"},
      {currentState: "S", condition: "b", nextState: "B"},
      {currentState: "S", condition: "c", nextState: "C"}
    ];
    const acceptState = "ACCEPT";
    const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
    expect(() => {fsa.compute(1);}).toThrow("Cannot compute");
  });

  describe("Post Conditions", () =>
  {
    test("Case 1", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "A", condition: "a", nextState: "ACCEPT"},
        {currentState: "ACCEPT", condition: "a", nextState: "ACCEPT"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a a".split(" "));
  
      fsa.compute(1);
      expect(fsa.isRunning()).toBe(true);
      expect(fsa.hasFinished()).toBe(false);
      expect(fsa.hasAccepted()).toBe(false);
      expect(fsa.getLivingThreads()[0].getLog()).toStrictEqual(["S", "A"]);
  
      fsa.compute(1);
      expect(fsa.isRunning()).toBe(false);
      expect(fsa.hasFinished()).toBe(true);
      expect(fsa.hasAccepted()).toBe(true);
      expect(fsa.getFinishedThreads()[0].getLog()).toStrictEqual(["S", "A", "ACCEPT"]);
    });

    test("Case 2", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "A", condition: "a", nextState: "ACCEPT"},
        {currentState: "ACCEPT", condition: "a", nextState: "ACCEPT"},
        {currentState: "A", condition: "a", nextState: "B"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a a".split(" "));

      fsa.compute(1);
      expect(fsa.isRunning()).toBe(true);
      expect(fsa.hasFinished()).toBe(false);
      expect(fsa.hasAccepted()).toBe(false);
      expect(fsa.getLivingThreads()[0].getLog()).toStrictEqual(["S", "A"]);
  
      fsa.compute(1);
      expect(fsa.isRunning()).toBe(false);
      expect(fsa.hasFinished()).toBe(true);
      expect(fsa.hasAccepted()).toBe(true);
      expect(fsa.getFinishedThreads()[0].getLog()).toStrictEqual(["S", "A", "ACCEPT"]);
      expect(fsa.getFinishedThreads()[1].getLog()).toStrictEqual(["S", "A", "B"]);
    });

    test("Dead end", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "A", condition: "a", nextState: "ACCEPT"},
        {currentState: "ACCEPT", condition: "a", nextState: "ACCEPT"},
        {currentState: "S", condition: "a", nextState: "B"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a a".split(" "));

      fsa.compute(1);
      expect(fsa.isRunning()).toBe(true);
      expect(fsa.hasFinished()).toBe(false);
      expect(fsa.hasAccepted()).toBe(false);
      expect(fsa.getLivingThreads()[0].getLog()).toStrictEqual(["S", "A"]);
      expect(fsa.getLivingThreads()[1].getLog()).toStrictEqual(["S", "B"]);
  
      fsa.compute(1);
      expect(fsa.isRunning()).toBe(true);
      expect(fsa.hasFinished()).toBe(false);
      expect(fsa.hasAccepted()).toBe(true);
      expect(fsa.getLivingThreads()[0].getLog()).toStrictEqual(["S", "B"]);
      expect(fsa.getFinishedThreads()[0].getLog()).toStrictEqual(["S", "A", "ACCEPT"]);

      fsa.compute(1);
      expect(fsa.isRunning()).toBe(false);
      expect(fsa.hasFinished()).toBe(true);
      expect(fsa.hasAccepted()).toBe(true);
      expect(fsa.getFinishedThreads()[0].getLog()).toStrictEqual(["S", "A", "ACCEPT"]);
    });
  });
});

describe("reset()", () => 
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "B", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "A", condition: "a", nextState: "ACCEPT"},
        {currentState: "ACCEPT", condition: "a", nextState: "ACCEPT"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a a".split(" "));

      fsa.compute(1);
      fsa.reset();
      expect(fsa.isRunning()).toBe(false);
      expect(fsa.hasFinished()).toBe(false);
      expect(fsa.getLivingThreads()[0].getLog()).toStrictEqual(["S"]);
    });
  });
});

describe("computeAll()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      const initialState = "S";
      const states = ["S", "A", "ACCEPT"];
      const transitions = [
        {currentState: "S", condition: "a", nextState: "A"},
        {currentState: "A", condition: "a", nextState: "A"},
        {currentState: "A", condition: "b", nextState: "ACCEPT"},
        {currentState: "ACCEPT", condition: "b", nextState: "ACCEPT"}
      ];
      const acceptState = "ACCEPT";
      const fsa = new FiniteStateAutomaton(initialState, states, transitions, acceptState);
      fsa.setInput("a a b b b".split(" "));

      fsa.computeAll();
      expect(fsa.isRunning()).toBe(false);
      expect(fsa.hasFinished()).toBe(true);
      expect(fsa.hasAccepted()).toBe(true);
      expect(fsa.getFinishedThreads()[0].getLog()).toStrictEqual(["S", "A", "A", "ACCEPT", "ACCEPT", "ACCEPT"]);
    });
  });
});




