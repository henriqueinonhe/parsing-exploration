"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductionRule_1 = require("../src/Core/ProductionRule");
const TokenSortTable_1 = require("../src/Core/TokenSortTable");
const TokenString_1 = require("../src/Core/TokenString");
describe("constructor", () => {
    describe("Pre Conditions", () => {
        test("Lhs must not be empty", () => {
            expect(() => { ProductionRule_1.ProductionRule.fromString("", ["Yada", "duba"]); }).toThrow("Left hand side of rule cannot be empty!");
        });
        test("Rhs must not be empty", () => {
            expect(() => { ProductionRule_1.ProductionRule.fromString("<expr>", []); }).toThrow("Right hand side of rule cannot be empty!");
            expect(() => { ProductionRule_1.ProductionRule.fromString("<expr>", [""]); }).not.toThrow();
        });
    });
    describe("Post Conditions", () => {
        test("Duplicate rhs alternatives are removed", () => {
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["AA", "B", "AA", "B", "AA", "C"]).getRhs().join(",")).toBe("AA,B,C");
        });
    });
});
describe("everyTokenList()", () => {
    describe("Post Conditions", () => {
        test("Lists every token", () => {
            expect(ProductionRule_1.ProductionRule.fromString("P <expr> Q", ["A + B", "C * D"]).everyTokenList().map(token => token.toString()).join(",")).toBe("P,<expr>,Q,A,+,B,C,*,D");
        });
        test("Removes duplicates", () => {
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"]).everyTokenList().map(token => token.toString()).join(",")).toBe("<expr>,(,+,),*,<digit>");
        });
    });
});
describe("isMonotonic()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenSortTable = {
                "A": TokenSortTable_1.TokenSort.NonTerminal,
                "B": TokenSortTable_1.TokenSort.NonTerminal,
                "S": TokenSortTable_1.TokenSort.NonTerminal,
                "a": TokenSortTable_1.TokenSort.Terminal,
                "b": TokenSortTable_1.TokenSort.Terminal,
                "C": TokenSortTable_1.TokenSort.NonTerminal,
                "D": TokenSortTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("A", [""]).isMonotonic(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A B", ["a"]).isMonotonic(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["S S S", "a b b", "a b a", "C D"]).isMonotonic(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A", ["a"]).isMonotonic(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A", [" a b", "a b b", "S"]).isMonotonic(tokenSortTable)).toBe(true);
        });
    });
});
describe("isERule()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenSortTable = {
                "A": TokenSortTable_1.TokenSort.NonTerminal,
                "B": TokenSortTable_1.TokenSort.NonTerminal,
                "S": TokenSortTable_1.TokenSort.NonTerminal,
                "a": TokenSortTable_1.TokenSort.Terminal,
                "b": TokenSortTable_1.TokenSort.Terminal,
                "C": TokenSortTable_1.TokenSort.NonTerminal,
                "D": TokenSortTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isERule(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", [""]).isERule(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", ""]).isERule(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "b"]).isERule(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isERule(tokenSortTable)).toBe(false);
        });
    });
});
describe("isContextFree()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenSortTable = {
                "<expr>": TokenSortTable_1.TokenSort.NonTerminal,
                "A": TokenSortTable_1.TokenSort.NonTerminal,
                "B": TokenSortTable_1.TokenSort.NonTerminal,
                "S": TokenSortTable_1.TokenSort.NonTerminal,
                "a": TokenSortTable_1.TokenSort.Terminal,
                "d": TokenSortTable_1.TokenSort.Terminal,
                "C": TokenSortTable_1.TokenSort.NonTerminal,
                "D": TokenSortTable_1.TokenSort.NonTerminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["A", "B", "", "a D S d A"]).isContextFree(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", [""]).isContextFree(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("<expr>", ["a", "B", "", "a D S d A"]).isContextFree(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a", ["A", "B", "", "a D S d A"]).isContextFree(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A B", ["A", "B", "", "a D S d A"]).isContextFree(tokenSortTable)).toBe(false);
        });
    });
});
describe("isRightRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenSortTable = {
                "S": TokenSortTable_1.TokenSort.NonTerminal,
                "A": TokenSortTable_1.TokenSort.NonTerminal,
                "a": TokenSortTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isRightRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a a a a"]).isRightRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a a a a S"]).isRightRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S"]).isRightRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isRightRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "a S", "a a a S", "S"]).isRightRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S a"]).isRightRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S a"]).isRightRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isRightRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a S S"]).isRightRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "a S", "a a a S", "S", "S a"]).isRightRegular(tokenSortTable)).toBe(false);
        });
    });
});
describe("isLeftRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenSortTable = {
                "S": TokenSortTable_1.TokenSort.NonTerminal,
                "A": TokenSortTable_1.TokenSort.NonTerminal,
                "a": TokenSortTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isLeftRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a a a a a"]).isLeftRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S a a a a a a "]).isLeftRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S"]).isLeftRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isLeftRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "S a", "S a a a", "S"]).isLeftRegular(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S"]).isLeftRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S a"]).isLeftRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isLeftRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S a a a"]).isLeftRegular(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["", "a", "S a", "S a a a", "S", "S S"]).isLeftRegular(tokenSortTable)).toBe(false);
        });
    });
});
describe("isContextSensitive()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const tokenSortTable = {
                "S": TokenSortTable_1.TokenSort.NonTerminal,
                "A": TokenSortTable_1.TokenSort.NonTerminal,
                "a": TokenSortTable_1.TokenSort.Terminal,
                "b": TokenSortTable_1.TokenSort.Terminal
            };
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a a S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S a a"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S a"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a a b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a S S b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a S S S S S b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a a b b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a S b b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a a S b b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S S S b A S S a", ["a S S a a a b A S S a"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["a S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S a", ["a S b a"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("a S a", ["a b S a"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A A S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S A A"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["S S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A S A"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A A b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S S b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S S S S S b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A A b b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S b b"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A S"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S A", ["A S b A"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("A S A", ["A b S A"]).isContextSensitive(tokenSortTable)).toBe(true);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S a", ["S"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S", ["S a"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["b S a"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("a S b", ["a b"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S", ["S A"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S A", ["S"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S", ["S A"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("S", [""]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["b S A"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A b"]).isContextSensitive(tokenSortTable)).toBe(false);
            expect(ProductionRule_1.ProductionRule.fromString("A S b", ["A S S b", "A b"]).isContextSensitive(tokenSortTable)).toBe(false);
        });
    });
});
describe("ProductionRuleParser", () => {
    describe("[private] findSubstringIndex()", () => {
        describe("Pre Conditions()", () => {
            test("Substring must be present within searched string", () => {
                expect(() => { ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Dobs dubs alsmdasadn asd", "frakets"); }).toThrow("Couldn't find");
                expect(() => { ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Dobs dubs alsmdasadn asd", "Dobs", 1); }).toThrow("Couldn't find");
                expect(() => { ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Dobs dubs alsmdasadn asd", "dubs", 10); }).toThrow("Couldn't find");
            });
        });
        describe("Post Conditions", () => {
            test("Search from the beginning", () => {
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "Lorem")).toBe(0);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "em")).toBe(3);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "sum")).toBe(8);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", " dobs")).toBe(16);
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "rem Ipsum dubs dobs")).toBe(2);
            });
            test("Whole string", () => {
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs", "Lorem Ipsum dubs dobs")).toBe(0);
            });
            test("More than one occurrence", () => {
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs dubs dubs dobs", "dubs")).toBe(12);
            });
            test("Start index != 0", () => {
                expect(ProductionRule_1.ProductionRuleParser["findSubstringBeginIndex"]("Lorem Ipsum dubs dobs dubs dubs dobs", "dubs", 14)).toBe(22);
            });
        });
    });
    describe("[private] findRightArrowBeginIndex()", () => {
        describe("Pre Conditions", () => {
            test("Right arrow absent", () => {
                // expect(() => {ProductionRuleParser["findRightArrowBeginIndex"](`"<expr>" asdas  a d,djald | ||| | asdas`, 9);}).toThrow(`String ended prematurely`);
            });
        });
    });
});
describe("clone()", () => {
    describe("Post Conditions", () => {
        test("actually clones", () => {
            const original = ProductionRule_1.ProductionRule.fromString("Number", ["Real", "Integer"]);
            const clone = original.clone();
            expect(clone.getLhs().toString()).toBe("Number");
            expect(clone.getRhs().map(tokenString => tokenString.toString())).toStrictEqual(["Real", "Integer"]);
        });
        test("Modifying clone doesn't affect original", () => {
            const original = ProductionRule_1.ProductionRule.fromString("Number", ["Real", "Integer"]);
            const clone = original.clone();
            clone["lhs"] = TokenString_1.TokenString.fromString("Dobs");
            expect(clone.getLhs().toString()).toBe("Dobs");
            expect(original.getLhs().toString()).toBe("Number");
        });
    });
});
describe("isEqual()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A", "A S", "A S A"]).isEqual(ProductionRule_1.ProductionRule.fromString("S", ["A", "A S", "A S A"]))).toBe(true);
        });
    });
});
describe("toString()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(ProductionRule_1.ProductionRule.fromString("S", ["A", "a", "A B B", "S A"]).toString()).toBe(`"S" -> "A" | "a" | "A B B" | "S A"`);
        });
    });
});
//# sourceMappingURL=ProductionRule.test.js.map