"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductionRule_1 = require("../src/ProductionRule");
const TokenTable_1 = require("../src/TokenTable");
describe("constructor", () => {
    describe("Pre Conditions", () => {
        test("Lhs must not be empty", () => {
            expect(() => { ProductionRule_1.ProductionRule.constructFromString("", ["Yada", "duba"]); }).toThrow("Left hand side of rule cannot be empty!");
        });
        test("Rhs must not be empty", () => {
            expect(() => { ProductionRule_1.ProductionRule.constructFromString("<expr>", []); }).toThrow("Right hand side of rule cannot be empty!");
            expect(() => { ProductionRule_1.ProductionRule.constructFromString("<expr>", [""]); }).not.toThrow();
        });
    });
    describe("Post Conditions", () => {
        test("Duplicate rhs options are removed", () => {
            expect(ProductionRule_1.ProductionRule.constructFromString("<expr>", ["AA", "B", "AA", "B", "AA", "C"]).getRhs().join(",")).toBe("AA,B,C");
        });
    });
});
describe("everyTokenList()", () => {
    describe("Post Conditions", () => {
        test("Lists every token", () => {
            expect(ProductionRule_1.ProductionRule.constructFromString("P <expr> Q", ["A + B", "C * D"]).everyTokenList().map(token => token.toString()).join(",")).toBe("P,<expr>,Q,A,+,B,C,*,D");
        });
        test("Removes duplicates", () => {
            expect(ProductionRule_1.ProductionRule.constructFromString("<expr>", ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"]).everyTokenList().map(token => token.toString()).join(",")).toBe("<expr>,(,+,),*,<digit>");
        });
    });
});
describe("isMonotonic()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "A": TokenTable_1.TokenSort.NonTerminal,
                "B": TokenTable_1.TokenSort.NonTerminal,
                "S": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "b": TokenTable_1.TokenSort.Terminal,
                "C": TokenTable_1.TokenSort.NonTerminal,
                "D": TokenTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.constructFromString("A", [""]).isMonotonic(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("A B", ["a"]).isMonotonic(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["S S S", "a b b", "a b a", "C D"]).isMonotonic(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("A", ["a"]).isMonotonic(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("A", [" a b", "a b b", "S"]).isMonotonic(tokenTable)).toBe(true);
        });
    });
});
describe("isERule()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "A": TokenTable_1.TokenSort.NonTerminal,
                "B": TokenTable_1.TokenSort.NonTerminal,
                "S": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "b": TokenTable_1.TokenSort.Terminal,
                "C": TokenTable_1.TokenSort.NonTerminal,
                "D": TokenTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.constructFromString("S", [""]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", [""]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["", ""]).isERule(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a"]).isERule(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["", "b"]).isERule(tokenTable)).toBe(false);
        });
    });
});
describe("isContextFree()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "<expr>": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "B": TokenTable_1.TokenSort.NonTerminal,
                "S": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "d": TokenTable_1.TokenSort.Terminal,
                "C": TokenTable_1.TokenSort.NonTerminal,
                "D": TokenTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.constructFromString("<expr>", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("<expr>", [""]).isContextFree(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("<expr>", ["a", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("A B", ["A", "B", "", "a D S d A"]).isContextFree(tokenTable)).toBe(false);
        });
    });
});
describe("isRightRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "S": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a a a a a a"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a a a a a a S"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", [""]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["", "a", "a S", "a a a S", "S"]).isRightRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S a"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a S a"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S S"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a a a S S"]).isRightRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["", "a", "a S", "a a a S", "S", "S a"]).isRightRegular(tokenTable)).toBe(false);
        });
    });
});
describe("isLeftRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "S": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a a a a a a"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S a a a a a a "]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", [""]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["", "a", "S a", "S a a a", "S"]).isLeftRegular(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a S"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a S a"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S S"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S S a a a"]).isLeftRegular(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["", "a", "S a", "S a a a", "S", "S S"]).isLeftRegular(tokenTable)).toBe(false);
        });
    });
});
describe("isContextSensitive()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenTable = {
                "S": TokenTable_1.TokenSort.NonTerminal,
                "A": TokenTable_1.TokenSort.NonTerminal,
                "a": TokenTable_1.TokenSort.Terminal,
                "b": TokenTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a a S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S a a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["S S"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a S a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a a b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a S S b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a S S S S S b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a a b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a S b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a a S b b"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S S S b A S S a", ["a S S a a a b A S S a"]).isContextSensitive(tokenTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", [""]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S a", ["S"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", ["a S"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S", ["S a"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("S", [""]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["b S a"]).isContextSensitive(tokenTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.constructFromString("a S b", ["a b"]).isContextSensitive(tokenTable)).toBe(false);
        });
    });
});
//# sourceMappingURL=ProductionRule.test.js.map