import { Matrix } from "../src/Matrix";

describe("constructor", () =>
{
  describe("Pre Conditions", () =>
  {
    test("Matrix cannot be empty", () =>
    {
      expect(() => {new Matrix([]);}).toThrow("Matrix cannot be empty!");
    });

    test("Columns cannot be empty!", () =>
    {
      expect(() => {new Matrix([[], [], []]);}).toThrow("Columns cannot be empty!");
    });

    test("All rows must have the same length", () =>
    {
      expect(() => {new Matrix<number>([[1, 2, 3], [4, 5, 6], [7, 8]]);}).toThrow("All rows must be the same length!");
      expect(() => {new Matrix<number>([[1, 3], [4, 5, 6], [7, 8]]);}).toThrow("All rows must be the same length!");
      expect(() => {new Matrix<number>([[1, 2, 3], [1]]);}).toThrow("All rows must be the same length!");

      expect(() => {new Matrix<number>([[1, 2], [4, 5], [7, 8]]);}).not.toThrow();
      expect(() => {new Matrix<number>([[1], [4], [7]]);}).not.toThrow();
      expect(() => {new Matrix<number>([[1]]);}).not.toThrow();
    });
  });
});