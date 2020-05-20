import { Token, TokenClass } from "../src/Token";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Token string validation", () =>
    {
      expect(() => {new Token(" ");}).toThrow("Invalid token string!");
      expect(() => {new Token("\n");}).toThrow("Invalid token string!");
      expect(() => {new Token("     ");}).toThrow("Invalid token string!");
      expect(() => {new Token("");}).toThrow("Invalid token string!");
      expect(() => {new Token("\t");}).toThrow("Invalid token string!");

      expect(() => {new Token("Asd");}).not.toThrow();
      expect(() => {new Token(";");}).not.toThrow();
      expect(() => {new Token(".");}).not.toThrow();
      expect(() => {new Token("->");}).not.toThrow();
      expect(() => {new Token("-");}).not.toThrow();
      expect(() => {new Token("+");}).not.toThrow();
      expect(() => {new Token("=");}).not.toThrow();
      expect(() => {new Token("a0s9djh3294nmasd");}).not.toThrow();
    });
  });

  describe("Post Conditions", () =>
  {
    test("Token string is set correctly during construction", () =>
    {
      expect(new Token("Jupiter").getTokenString()).toBe("Jupiter");
      expect(new Token("da9duna890dn").getTokenString()).toBe("da9duna890dn");
      expect(new Token("DMIad9s9auj3").getTokenString()).toBe("DMIad9s9auj3");
      expect(new Token("aaaaaaaaa").getTokenString()).toBe("aaaaaaaaa");

      expect(new Token("Jupiter").isTerminal()).toBe(true);
      expect(new Token("da9duna890dn").isTerminal()).toBe(true);
      expect(new Token("DMIad9s9auj3").isTerminal()).toBe(true);
      expect(new Token("aaaaaaaaa").isTerminal()).toBe(true);

      expect(new Token("Jupiter", TokenClass.NonTerminal).isTerminal()).toBe(false);
      expect(new Token("da9duna890dn", TokenClass.NonTerminal).isTerminal()).toBe(false);
      expect(new Token("DMIad9s9auj3", TokenClass.NonTerminal).isTerminal()).toBe(false);
      expect(new Token("aaaaaaaaa", TokenClass.NonTerminal).isTerminal()).toBe(false);
    });
  }); 
});