import { Utils } from "../src/Core/Utils";

describe("factorial()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(Utils.factorial(0)).toBe(1);
      expect(Utils.factorial(1)).toBe(1);
      expect(Utils.factorial(2)).toBe(2);
      expect(Utils.factorial(3)).toBe(6);
      expect(Utils.factorial(4)).toBe(24);
      expect(Utils.factorial(5)).toBe(120);
      expect(Utils.factorial(6)).toBe(720);
      expect(Utils.factorial(15)).toBe(1307674368000);
    });
  });
});

describe("findPivotIndex()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty groups not allowed", () =>
    {
      expect(Utils.findPivotIndex([1, 2, 3], 4)).toBe(2);
      expect(Utils.findPivotIndex([1, 2, 4], 4)).toBe(1);
      expect(Utils.findPivotIndex([1, 3, 4], 4)).toBe(0);
      expect(Utils.findPivotIndex([2, 3, 4], 4)).toBe(-1);
    });

    test("Allow empty groups", () =>
    {
      expect(Utils.findPivotIndex([1, 2, 3], 4, true)).toBe(2);
      expect(Utils.findPivotIndex([1, 2, 4], 4, true)).toBe(1);
      expect(Utils.findPivotIndex([1, 3, 4], 4, true)).toBe(1);
      expect(Utils.findPivotIndex([1, 4, 4], 4, true)).toBe(0);
      expect(Utils.findPivotIndex([4, 4, 4], 4, true)).toBe(-1);
    });
  });
});

describe("advanceToNextDividersIndexList()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty groups not allowed", () =>
    {
      const dividersIndexList = [1, 2, 3, 5, 7];
      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 5, 8]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 5, 9]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 6, 7]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 6, 8]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 6, 9]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 7, 8]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 7, 9]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 8, 9]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 4, 5, 6]);
    });

    test("Empty groups not allowed", () =>
    {
      const dividersIndexList = [1, 5, 6, 7, 8];
      Utils.advanceToNextDividersIndexList(dividersIndexList, 8);
      expect(dividersIndexList).toEqual([2, 3, 4, 5, 6]);
    });

    test("Empty groups allowed", () =>
    {
      const dividersIndexList = [2, 5, 5];

      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([2, 5, 6]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([2, 6, 6]);
      
      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 3]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 4]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 5]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 6]);

      Utils.advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 4, 4]);
    });
  });
});

describe("generatePartition()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(Utils.generatePartition([1, 2, 3, 4, 5], [2, 3])).toEqual([[1, 2], [3], [4, 5]]);
      expect(Utils.generatePartition([1, 2, 3, 4, 5], [1, 2, 3, 4])).toEqual([[1], [2], [3], [4], [5]]);
      expect(Utils.generatePartition([1, 2, 3, 4, 5], [0, 0, 2, 4])).toEqual([[], [], [1, 2], [3, 4], [5]]);
    });
  });
});

describe("List Non Empty Partitions", () =>
{
  describe("Post Conditions", () =>
  {
    test("Non empty groups", () =>
    {
      expect(Utils.listPartitions([0, 1, 2, 3, 4, 5, 6], 4)).toEqual(
        [
          [[0], [1], [2], [3, 4, 5, 6]],
          [[0], [1], [2, 3], [4, 5, 6]],
          [[0], [1], [2, 3, 4], [5, 6]],
          [[0], [1], [2, 3, 4, 5], [6]],
          [[0], [1, 2], [3], [4, 5, 6]],
          [[0], [1, 2], [3, 4], [5, 6]],
          [[0], [1, 2], [3, 4, 5], [6]],
          [[0], [1, 2, 3], [4], [5, 6]],
          [[0], [1, 2, 3], [4, 5], [6]],
          [[0], [1, 2, 3, 4], [5], [6]],
          [[0, 1], [2], [3], [4, 5, 6]],
          [[0, 1], [2], [3, 4], [5, 6]],
          [[0, 1], [2], [3, 4, 5], [6]],
          [[0, 1], [2, 3], [4], [5, 6]],
          [[0, 1], [2, 3], [4, 5], [6]],
          [[0, 1], [2, 3, 4], [5], [6]],
          [[0, 1, 2], [3], [4], [5, 6]],
          [[0, 1, 2], [3], [4, 5], [6]],
          [[0, 1, 2], [3, 4], [5], [6]],
          [[0, 1, 2, 3], [4], [5], [6]]
        ]
      );
    });

    test("With empty groups", () =>
    {
      expect(Utils.listPartitions([0, 1, 2, 3, 4, 5], 3, true)).toEqual(
        [
          [[], [], [0, 1, 2, 3, 4, 5]],
          [[], [0], [1, 2, 3, 4, 5]],
          [[], [0, 1], [2, 3, 4, 5]],
          [[], [0, 1, 2], [3, 4, 5]],
          [[], [0, 1, 2, 3], [4, 5]],
          [[], [0, 1, 2, 3, 4], [5]],
          [[], [0, 1, 2, 3, 4, 5], []],
          [[0], [], [1, 2, 3, 4, 5]],
          [[0], [1], [2, 3, 4, 5]],
          [[0], [1, 2], [3, 4, 5]],
          [[0], [1, 2, 3], [4, 5]],
          [[0], [1, 2, 3, 4], [5]],
          [[0], [1, 2, 3, 4, 5], []],
          [[0, 1], [], [2, 3, 4, 5]],
          [[0, 1], [2], [3, 4, 5]],
          [[0, 1], [2, 3], [4, 5]],
          [[0, 1], [2, 3, 4], [5]],
          [[0, 1], [2, 3, 4, 5], []],
          [[0, 1, 2], [], [3, 4, 5]],
          [[0, 1, 2], [3], [4, 5]],
          [[0, 1, 2], [3, 4], [5]],
          [[0, 1, 2], [3, 4, 5], []],
          [[0, 1, 2, 3], [], [4, 5]],
          [[0, 1, 2, 3], [4], [5]],
          [[0, 1, 2, 3], [4, 5], []],
          [[0, 1, 2, 3, 4], [], [5]],
          [[0, 1, 2, 3, 4], [5], []],
          [[0, 1, 2, 3, 4, 5], [], []]
        ]
      );
    });
  });
});

describe("permutationsWithRepetitions()", () => 
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(Utils.permutationsWithRepetitionsCount(10, 8, 2)).toBe(45);
    });
  });
});