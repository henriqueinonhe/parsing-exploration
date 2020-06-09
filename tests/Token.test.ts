import { Token } from "../src/Core/Token";

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
      expect(() => {new Token("dads\"dasdasd");}).toThrow("Invalid token string!");
      expect(() => {new Token("\"");}).toThrow("Invalid token string!");

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
      expect(new Token("Jupiter").toString()).toBe("Jupiter");
      expect(new Token("da9duna890dn").toString()).toBe("da9duna890dn");
      expect(new Token("DMIad9s9auj3").toString()).toBe("DMIad9s9auj3");
      expect(new Token("aaaaaaaaa").toString()).toBe("aaaaaaaaa");

    });
  }); 
});

describe("clone()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new Token("Dobs").clone().toString()).toBe("Dobs");
    });
  });
});