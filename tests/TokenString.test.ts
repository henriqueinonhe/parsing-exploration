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