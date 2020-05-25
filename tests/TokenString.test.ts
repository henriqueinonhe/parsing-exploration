import { TokenString } from "../src/TokenString";

describe("toString()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(TokenString.fromString("").toString()).toBe("");
      expect(TokenString.fromString("Dobs").toString()).toBe("Dobs");
      expect(TokenString.fromString("i -> o").toString()).toBe("i -> o");
      expect(TokenString.fromString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
    });
  });
});

describe("isEmpty()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(TokenString.fromString("").isEmpty()).toBe(true);
      expect(TokenString.fromString("a").isEmpty()).toBe(false);
    });
  });
});

describe("isEqual()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(TokenString.fromString("").isEqual(TokenString.fromString(""))).toBe(true);
      expect(TokenString.fromString(" as d").isEqual(TokenString.fromString("a sd"))).toBe(false);
    });
  });
});

describe("slice()", () =>
{
  describe("Post Conditions", () =>
  {
    test("One argument only", () =>
    {
      expect(TokenString.fromString("A B C   D   E").slice(0).isEqual(TokenString.fromString("A B C D E"))).toBe(true);
      expect(TokenString.fromString("A B C D E").slice(3).isEqual(TokenString.fromString("D E"))).toBe(true);
    });
  });
});

describe("startsWith()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty string", () =>
    {
      expect(TokenString.fromString("asdasd").startsWith(TokenString.fromString(""))).toBe(true);
    });

    test("Happy path", () =>
    {
      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("y"))).toBe(true);
      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("y a"))).toBe(true);
      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("y a d d a"))).toBe(true);

      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("Y"))).toBe(false);
      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("y a d a"))).toBe(false);
      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("a d s a sd"))).toBe(false);
      expect(TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString.fromString("y a d d a D u d a d a b a a a"))).toBe(false);
    });
  });
});

describe("endsWith()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty String", () =>
    {
      expect(TokenString.fromString("as da ds").endsWith(TokenString.fromString(""))).toBe(true);
    });

    test("Default", () =>
    {
      expect(TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString.fromString("Individual"))).toBe(true);
      expect(TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString.fromString("Prop  -> Individual"))).toBe(true);
      expect(TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString.fromString("Prop -> Prop -> Individual"))).toBe(true);

      expect(TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString.fromString("Prop"))).toBe(false);
      expect(TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString.fromString("asd asd a sd"))).toBe(false);
      expect(TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString.fromString("Prop -> Prop -> Prop -> Individual"))).toBe(false);
    });
  });
});