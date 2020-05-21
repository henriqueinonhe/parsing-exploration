"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProductionRule_1 = require("../src/ProductionRule");
describe("constructor", function () {
    describe("Pre Conditions", function () {
        test("Lhs must not be empty", function () {
            expect(function () { new ProductionRule_1.ProductionRule("", ["Yada", "duba"]); }).toThrow("Left hand side of rule cannot be empty!");
        });
        test("Rhs must not be empty", function () {
            expect(function () { new ProductionRule_1.ProductionRule("<expr>", []); }).toThrow("Right hand side of rule cannot be empty!");
            expect(function () { new ProductionRule_1.ProductionRule("<expr>", [""]); }).not.toThrow();
        });
    });
    describe("Post Conditions", function () {
        test("Duplicate rhs options are removed", function () {
            expect(new ProductionRule_1.ProductionRule("<expr>", ["AA", "B", "AA", "B", "AA", "C"]).getRhs().join(",")).toBe("AA,B,C");
        });
    });
});
describe("everyTokenList()", function () {
    describe("Post Conditions", function () {
        test("Lists every token", function () {
            expect(new ProductionRule_1.ProductionRule("P <expr> Q", ["A + B", "C * D"]).everyTokenList().map(function (token) { return token.toString(); }).join(",")).toBe("P,<expr>,Q,A,+,B,C,*,D");
        });
    });
});
//# sourceMappingURL=ProductionRule.test.js.map