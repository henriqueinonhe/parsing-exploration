import { Token } from "../src/Token";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Token string validation", () =>
    {
      expect(() => {new Token(" ", "Class");}).toThrow("Invalid token string!");
      expect(() => {new Token("\n", "Class");}).toThrow("Invalid token string!");
      expect(() => {new Token("     ", "Class");}).toThrow("Invalid token string!");
      expect(() => {new Token("", "Class");}).toThrow("Invalid token string!");
      expect(() => {new Token("\t", "Class");}).toThrow("Invalid token string!");

      expect(() => {new Token("Asd", "Class");}).not.toThrow();
      expect(() => {new Token(";", "Class");}).not.toThrow();
      expect(() => {new Token(".", "Class");}).not.toThrow();
      expect(() => {new Token("->", "Class");}).not.toThrow();
      expect(() => {new Token("-", "Class");}).not.toThrow();
      expect(() => {new Token("+", "Class");}).not.toThrow();
      expect(() => {new Token("=", "Class");}).not.toThrow();
      expect(() => {new Token("a0s9djh3294nmasd", "Class");}).not.toThrow();
    });

    test("Token class validation", () =>
    {
      expect(() => {new Token("A", " dobs");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", "34sdad");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", "sda dsd");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", ",dsda");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", "\nsda");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", "Jiue.s");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", ";ds");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", "");}).toThrow("Invalid token class!");
      expect(() => {new Token("A", " ");}).toThrow("Invalid token class!");

      expect(() => {new Token("A", "Jupiter");}).not.toThrow();
      expect(() => {new Token("A", "da9duna890dn");}).not.toThrow();
      expect(() => {new Token("A", "DMIad9s9auj3");}).not.toThrow();
      expect(() => {new Token("A", "aaaaaaaaa");}).not.toThrow();

    });
  });

  describe("Post Conditions", () =>
  {
    test("Token string is set correctly during construction", () =>
    {
      expect(new Token("Jupiter", "Class").getTokenString()).toBe("Jupiter");
      expect(new Token("da9duna890dn", "Class").getTokenString()).toBe("da9duna890dn");
      expect(new Token("DMIad9s9auj3", "Class").getTokenString()).toBe("DMIad9s9auj3");
      expect(new Token("aaaaaaaaa", "Class").getTokenString()).toBe("aaaaaaaaa");
    });

    test("Class string is set correctly during construction", () =>
    {
      expect(new Token(";;)90(", "Jupiter").getTokenClass()).toBe("Jupiter");
      expect(new Token(";;)90(", "da9duna890dn").getTokenClass()).toBe("da9duna890dn");
      expect(new Token(";;)90(", "DMIad9s9auj3").getTokenClass()).toBe("DMIad9s9auj3");
      expect(new Token(";;)90(", "aaaaaaaaa").getTokenClass()).toBe("aaaaaaaaa");
    });
  }); 
});