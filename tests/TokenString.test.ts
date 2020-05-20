import { TokenString } from "../src/TokenString";

describe("toString()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new TokenString("").toString()).toBe("");
      expect(new TokenString("Dobs").toString()).toBe("Dobs");
      expect(new TokenString("i -> o").toString()).toBe("i -> o");
      expect(new TokenString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
    });
  });
});

describe("isEmpty()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new TokenString("").isEmpty()).toBe(true);
      expect(new TokenString("a").isEmpty()).toBe(false);
    });
  });
});

describe("isEqual()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(new TokenString("").isEqual(new TokenString(""))).toBe(true);
      expect(new TokenString(" as d").isEqual(new TokenString("a sd"))).toBe(false);
    });
  });
});