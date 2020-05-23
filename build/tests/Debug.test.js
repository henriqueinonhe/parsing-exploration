"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug_1 = require("../src/Debug");
describe("factorial()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(Debug_1.factorial(0)).toBe(1);
            expect(Debug_1.factorial(1)).toBe(1);
            expect(Debug_1.factorial(2)).toBe(2);
            expect(Debug_1.factorial(3)).toBe(6);
            expect(Debug_1.factorial(4)).toBe(24);
            expect(Debug_1.factorial(5)).toBe(120);
            expect(Debug_1.factorial(6)).toBe(720);
            expect(Debug_1.factorial(15)).toBe(1307674368000);
        });
    });
});
describe("findPivotIndex()", () => {
    describe("Post Conditions", () => {
        test("Empty groups not allowed", () => {
            expect(Debug_1.findPivotIndex([1, 2, 3], 4)).toBe(2);
            expect(Debug_1.findPivotIndex([1, 2, 4], 4)).toBe(1);
            expect(Debug_1.findPivotIndex([1, 3, 4], 4)).toBe(0);
            expect(Debug_1.findPivotIndex([2, 3, 4], 4)).toBe(-1);
        });
        test("Allow empty groups", () => {
            expect(Debug_1.findPivotIndex([1, 2, 3], 4, true)).toBe(2);
            expect(Debug_1.findPivotIndex([1, 2, 4], 4, true)).toBe(1);
            expect(Debug_1.findPivotIndex([1, 3, 4], 4, true)).toBe(1);
            expect(Debug_1.findPivotIndex([1, 4, 4], 4, true)).toBe(0);
            expect(Debug_1.findPivotIndex([4, 4, 4], 4, true)).toBe(-1);
        });
    });
});
describe("advanceToNextDividersIndexList()", () => {
    describe("Post Conditions", () => {
        test("Empty groups not allowed", () => {
            const dividersIndexList = [1, 2, 3, 5, 7];
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 5, 8]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 5, 9]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 6, 7]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 6, 8]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 6, 9]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 7, 8]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 7, 9]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 3, 8, 9]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 9);
            expect(dividersIndexList).toEqual([1, 2, 4, 5, 6]);
        });
        test("Empty groups not allowed", () => {
            const dividersIndexList = [1, 5, 6, 7, 8];
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 8);
            expect(dividersIndexList).toEqual([2, 3, 4, 5, 6]);
        });
        test("Empty groups allowed", () => {
            const dividersIndexList = [2, 5, 5];
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([2, 5, 6]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([2, 6, 6]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([3, 3, 3]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([3, 3, 4]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([3, 3, 5]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([3, 3, 6]);
            Debug_1.advanceToNextDividersIndexList(dividersIndexList, 6, true);
            expect(dividersIndexList).toEqual([3, 4, 4]);
        });
    });
});
describe("generatePartition()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(Debug_1.generatePartition([1, 2, 3, 4, 5], [2, 3])).toEqual([[1, 2], [3], [4, 5]]);
            expect(Debug_1.generatePartition([1, 2, 3, 4, 5], [1, 2, 3, 4])).toEqual([[1], [2], [3], [4], [5]]);
            expect(Debug_1.generatePartition([1, 2, 3, 4, 5], [0, 0, 2, 4])).toEqual([[], [], [1, 2], [3, 4], [5]]);
        });
    });
});
describe("List Non Empty Partitions", () => {
    describe("Post Conditions", () => {
        test("Non empty groups", () => {
            expect(Debug_1.listPartitions([0, 1, 2, 3, 4, 5, 6], 4)).toEqual([
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
            ]);
        });
        test("With empty groups", () => {
            expect(Debug_1.listPartitions([0, 1, 2, 3, 4, 5], 3, true)).toEqual([
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
            ]);
        });
    });
});
describe("permutationsWithRepetitions()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(Debug_1.permutationsWithRepetitionsCount(10, 8, 2)).toBe(45);
        });
    });
});
//# sourceMappingURL=Debug.test.js.map