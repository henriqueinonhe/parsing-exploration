import { TokenString } from "../src/TokenString";

describe("toString()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(TokenString.constructFromString("").toString()).toBe("");
      expect(TokenString.constructFromString("Dobs").toString()).toBe("Dobs");
      expect(TokenString.constructFromString("i -> o").toString()).toBe("i -> o");
      expect(TokenString.constructFromString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
    });
  });
});

describe("isEmpty()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(TokenString.constructFromString("").isEmpty()).toBe(true);
      expect(TokenString.constructFromString("a").isEmpty()).toBe(false);
    });
  });
});

describe("isEqual()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(TokenString.constructFromString("").isEqual(TokenString.constructFromString(""))).toBe(true);
      expect(TokenString.constructFromString(" as d").isEqual(TokenString.constructFromString("a sd"))).toBe(false);
    });
  });
});

describe("slice()", () =>
{
  describe("Post Conditions", () =>
  {
    test("One argument only", () =>
    {
      expect(TokenString.constructFromString("A B C   D   E").slice(0).isEqual(TokenString.constructFromString("A B C D E"))).toBe(true);
      expect(TokenString.constructFromString("A B C D E").slice(3).isEqual(TokenString.constructFromString("D E"))).toBe(true);
    });
  });
});

describe("startsWith()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty string", () =>
    {
      expect(TokenString.constructFromString("asdasd").startsWith(TokenString.constructFromString(""))).toBe(true);
    });

    test("Happy path", () =>
    {
      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("y"))).toBe(true);
      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("y a"))).toBe(true);
      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("y a d d a"))).toBe(true);

      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("Y"))).toBe(false);
      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("y a d a"))).toBe(false);
      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("a d s a sd"))).toBe(false);
      expect(TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString.constructFromString("y a d d a D u d a d a b a a a"))).toBe(false);
    });
  });
});

describe("endsWith()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty String", () =>
    {
      expect(TokenString.constructFromString("as da ds").endsWith(TokenString.constructFromString(""))).toBe(true);
    });

    test("Default", () =>
    {
      expect(TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString.constructFromString("Individual"))).toBe(true);
      expect(TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString.constructFromString("Prop  -> Individual"))).toBe(true);
      expect(TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString.constructFromString("Prop -> Prop -> Individual"))).toBe(true);

      expect(TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString.constructFromString("Prop"))).toBe(false);
      expect(TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString.constructFromString("asd asd a sd"))).toBe(false);
      expect(TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString.constructFromString("Prop -> Prop -> Prop -> Individual"))).toBe(false);
    });
  });
});