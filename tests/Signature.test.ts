import { Signature } from "../src/Signature";
import { Token, TokenClass } from "../src/Token";

describe("getTokenRef(), addToken()", () =>
{
  //getTokenRef() and addToken() are way too coupled to be tested separtely
  // and both their pre and post conditions are also coupled.
  test("", () =>
  {
    const signature = new Signature();
    expect(() => {signature.getTokenRef("A");}).toThrow("There is no token");

    expect(() => {signature.addToken(new Token("A", TokenClass.NonTerminal));}).not.toThrow();
    expect(signature.getTokenRef("A").getTokenString()).toBe("A");
    expect(signature.getTokenRef("A").isTerminal()).toBe(false);

    expect(() => {signature.addToken(new Token("A", TokenClass.Terminal));}).toThrow("already is");
    expect(() => {signature.getTokenRef("a");}).toThrow("There is no token");
    expect(() => {signature.addToken(new Token("a", TokenClass.Terminal));}).not.toThrow();

    expect(signature.getTokenRef("a").getTokenString()).toBe("a");
    expect(signature.getTokenRef("a").isTerminal()).toBe(true);

  });
});