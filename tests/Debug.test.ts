import { factorial, findPivotIndex, advanceToNextDividersIndexList, generatePartition, listNonEmptyPartitions as listPartitions, permutationsWithRepetitionsCount, listNonEmptyPartitions } from "../src/Debug";

describe("factorial()", () =>
{
  describe("Post Conditions", () =>
  {
    test("", () =>
    {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(2)).toBe(2);
      expect(factorial(3)).toBe(6);
      expect(factorial(4)).toBe(24);
      expect(factorial(5)).toBe(120);
      expect(factorial(6)).toBe(720);
      expect(factorial(15)).toBe(1307674368000);
    });
  });
});

describe("findPivotIndex()", () =>
{
  describe("Post Conditions", () =>
  {
    test("Empty groups not allowed", () =>
    {
      expect(findPivotIndex([1, 2, 3], 4)).toBe(2);
      expect(findPivotIndex([1, 2, 4], 4)).toBe(1);
      expect(findPivotIndex([1, 3, 4], 4)).toBe(0);
      expect(findPivotIndex([2, 3, 4], 4)).toBe(-1);
    });

    test("Allow empty groups", () =>
    {
      expect(findPivotIndex([1, 2, 3], 4, true)).toBe(2);
      expect(findPivotIndex([1, 2, 4], 4, true)).toBe(1);
      expect(findPivotIndex([1, 3, 4], 4, true)).toBe(1);
      expect(findPivotIndex([1, 4, 4], 4, true)).toBe(0);
      expect(findPivotIndex([4, 4, 4], 4, true)).toBe(-1);
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
      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 5, 8]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 5, 9]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 6, 7]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 6, 8]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 6, 9]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 7, 8]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 7, 9]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 3, 8, 9]);

      advanceToNextDividersIndexList(dividersIndexList, 9);
      expect(dividersIndexList).toEqual([1, 2, 4, 5, 6]);
    });

    test("Empty groups not allowed", () =>
    {
      const dividersIndexList = [1, 5, 6, 7, 8];
      advanceToNextDividersIndexList(dividersIndexList, 8);
      expect(dividersIndexList).toEqual([2, 3, 4, 5, 6]);
    });

    test("Empty groups allowed", () =>
    {
      const dividersIndexList = [2, 5, 5];

      advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([2, 5, 6]);

      advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([2, 6, 6]);
      
      advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 3]);

      advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 4]);

      advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 5]);

      advanceToNextDividersIndexList(dividersIndexList, 6, true);
      expect(dividersIndexList).toEqual([3, 3, 6]);

      advanceToNextDividersIndexList(dividersIndexList, 6, true);
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
      expect(generatePartition([1, 2, 3, 4, 5], [2, 3])).toEqual([[1, 2], [3], [4, 5]]);
      expect(generatePartition([1, 2, 3, 4, 5], [1, 2, 3, 4])).toEqual([[1], [2], [3], [4], [5]]);
      expect(generatePartition([1, 2, 3, 4, 5], [0, 0, 2, 4])).toEqual([[], [], [1, 2], [3, 4], [5]]);
    });
  });
});

describe("List Non Empty Partitions", () =>
{
  describe("Post Conditions", () =>
  {
    test("Non empty groups", () =>
    {
      expect(listPartitions([0, 1, 2, 3, 4, 5, 6], 4)).toEqual(
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
      expect(listNonEmptyPartitions([0, 1, 2, 3, 4, 5], 3, true)).toEqual(
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
      expect(permutationsWithRepetitionsCount(10, 8, 2)).toBe(45);
    });
  });
});