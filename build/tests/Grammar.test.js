"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("../src/Core/Grammar");
const TokenSortTable_1 = require("../src/Core/TokenSortTable");
const TokenString_1 = require("../src/Core/TokenString");
describe("constructor", () => {
    describe("Pre Conditions", () => {
        test("Terminals and non terminals must be disjunct", () => {
            expect(() => { Grammar_1.Grammar.fromStrings(["A", "B", "C"], ["a", "B", "c"], [], "A"); }).toThrow(`Tokens "B" appear both as terminals and non terminals!`);
            expect(() => { Grammar_1.Grammar.fromStrings(["A", "B", "C"], ["A", "b", "C"], [], "A"); }).toThrow(`Tokens "A", "C" appear both as terminals and non terminals!`);
        });
        test("Every token that occurs in production rules must also be present in the token table", () => {
            const nonTerminals = ["<expr>", "<prim>", "<comp>"];
            const terminals = ["i", "o", "->"];
            const rules = [
                { lhs: "<expr>", rhs: ["<prim>", "<comp>"] },
                { lhs: "<prim>", rhs: ["i", "o"] },
                { lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"] },
                { lhs: "<prod>", rhs: ["[ <expr> <more> ]"] },
                { lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"] }
            ];
            const startSymbol = "<expr>";
            expect(() => { Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol); }).toThrow(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "(", ")", "<prod>", "[", "<more>", "]", ","!`);
        });
        test("Start symbol must be present in the token table", () => {
            const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
            const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
            const rules = [
                { lhs: "<expr>", rhs: ["<prim>", "<comp>"] },
                { lhs: "<prim>", rhs: ["i", "o"] },
                { lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"] },
                { lhs: "<prod>", rhs: ["[ <expr> <more> ]"] },
                { lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"] }
            ];
            const startSymbol = "<COMP>";
            expect(() => { Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol); }).toThrow(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
        });
    });
    describe("Post Conditions", () => {
        test("Token table registers every token correctly", () => {
            const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
            const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
            const rules = [
                { lhs: "<expr>", rhs: ["<prim>", "<comp>"] },
                { lhs: "<prim>", rhs: ["i", "o"] },
                { lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"] },
                { lhs: "<prod>", rhs: ["[ <expr> <more> ]"] },
                { lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"] }
            ];
            const startSymbol = "<expr>";
            const tokenSortTable = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getTokenSortTable();
            for (const nonTerminal of nonTerminals) {
                expect(tokenSortTable[nonTerminal]).toBe(TokenSortTable_1.TokenSort.NonTerminal);
            }
            for (const terminal of terminals) {
                expect(tokenSortTable[terminal]).toBe(TokenSortTable_1.TokenSort.Terminal);
            }
        });
        test("Rules are correctly merged", () => {
            const nonTerminals = ["S"];
            const terminals = ["a"];
            const rules = [
                { lhs: "S", rhs: ["a"] },
                { lhs: "S", rhs: ["a S"] }
            ];
            const startSymbol = "S";
            expect(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getRules().map(rule => { return { lhs: rule.getLhs().toString(), rhs: rule.getRhs().map(elem => elem.toString()) }; })).toStrictEqual([{ lhs: "S", rhs: ["a S", "a"] }]);
        });
    });
});
describe("isRightRegular()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const nonTerminals = ["S", "A", "B"];
            const terminals = ["a", "b"];
            const rules = [
                { lhs: "S", rhs: ["a S", "a", "A"] },
                { lhs: "A", rhs: ["b A", "B"] },
                { lhs: "B", rhs: ["b"] }
            ];
            const startSymbol = "S";
            expect(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).isRightRegular()).toBe(true);
            const rules2 = [
                { lhs: "S", rhs: ["a S", "a", "A S"] },
                { lhs: "A", rhs: ["b A", "B"] },
                { lhs: "B", rhs: ["b"] }
            ];
            expect(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules2, startSymbol).isRightRegular()).toBe(false);
        });
    });
});
describe("queryRule()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            var _a;
            const nonTerminals = ["S", "A", "B"];
            const terminals = ["a", "b"];
            const rules = [
                { lhs: "S", rhs: ["a S", "a", "A"] },
                { lhs: "A", rhs: ["b A", "B"] },
                { lhs: "S B", rhs: ["b"] }
            ];
            const startSymbol = "S";
            expect((_a = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).queryRule(TokenString_1.TokenString.fromString("S B"))) === null || _a === void 0 ? void 0 : _a.getRhs()[0].toString()).toBe("b");
        });
    });
});
describe("hasChomskyNormalForm()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const nonTerminals = ["S", "A", "B", "C"];
            const terminals = ["a", "b", "c"];
            const rules1 = [
                { lhs: "S", rhs: ["A A", "S A", "a", ""] },
                { lhs: "A", rhs: ["A B", "a"] },
                { lhs: "B", rhs: ["b", "B C"] },
                { lhs: "C", rhs: ["c"] }
            ];
            const startSymbol = "S";
            expect(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules1, startSymbol).hasChomskyNormalForm()).toBe(true);
            const rules2 = [
                { lhs: "S", rhs: ["A A", "S A", "a"] },
                { lhs: "A", rhs: ["A B", "a", ""] },
                { lhs: "B", rhs: ["b", "B C"] },
                { lhs: "C", rhs: ["c"] }
            ];
            expect(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules2, startSymbol).hasChomskyNormalForm()).toBe(false);
        });
    });
});
describe("getStartingRule()", () => {
    describe("Post Conditions", () => {
        test("Happy Path", () => {
            var _a;
            const nonTerminals = ["S", "A", "B"];
            const terminals = ["a", "b"];
            const rules = [
                { lhs: "S", rhs: ["a S", "a", "A"] },
                { lhs: "A", rhs: ["b A", "B"] },
                { lhs: "S B", rhs: ["b"] }
            ];
            const startSymbol = "S";
            expect((_a = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getStartingRule()) === null || _a === void 0 ? void 0 : _a.getLhs().toString()).toBe("S");
        });
        test("No starting rule", () => {
            var _a;
            const nonTerminals = ["S", "A", "B"];
            const terminals = ["a", "b"];
            const rules = [
                { lhs: "A", rhs: ["b A", "B"] },
                { lhs: "S B", rhs: ["b"] }
            ];
            const startSymbol = "S";
            expect((_a = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).getStartingRule()) === null || _a === void 0 ? void 0 : _a.getLhs().toString()).toBe(undefined);
        });
    });
});
describe("isEqual()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const nonTerminals = ["S", "A", "B", "C"];
            const terminals = ["a", "b", "c"];
            const rules = [
                { lhs: "S", rhs: ["A A", "S A", "a", ""] },
                { lhs: "A", rhs: ["A B", "a"] },
                { lhs: "B", rhs: ["b", "B C"] },
                { lhs: "C", rhs: ["c"] }
            ];
            const startSymbol = "S";
            expect(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol).isEqual(Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol)));
        });
    });
});
describe("clone()", () => {
    describe("Post Conditions", () => {
        test("Cloned correctly", () => {
            const nonTerminals = ["S", "A", "B", "C"];
            const terminals = ["a", "b", "c"];
            const rules = [
                { lhs: "S", rhs: ["A A", "S A", "a", ""] },
                { lhs: "A", rhs: ["A B", "a"] },
                { lhs: "B", rhs: ["b", "B C"] },
                { lhs: "C", rhs: ["c"] }
            ];
            const startSymbol = "S";
            const original = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
            const clone = original.clone();
            expect(original.isEqual(clone));
            expect(clone.isEqual(original));
        });
        test("Modifying clone doesn't affect original", () => {
            const nonTerminals = ["S", "A", "B", "C"];
            const terminals = ["a", "b", "c"];
            const rules = [
                { lhs: "S", rhs: ["A A", "S A", "a", ""] },
                { lhs: "A", rhs: ["A B", "a"] },
                { lhs: "B", rhs: ["b", "B C"] },
                { lhs: "C", rhs: ["c"] }
            ];
            const startSymbol = "S";
            const original = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
            const clone = original.clone();
            clone.getTokenSortTable()["S"] = TokenSortTable_1.TokenSort.Terminal;
            expect(original.getTokenSortTable()["S"]).toBe(TokenSortTable_1.TokenSort.NonTerminal);
        });
    });
});
describe("listTerminals()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
            const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
            const rules = [
                { lhs: "<expr>", rhs: ["<prim>", "<comp>"] },
                { lhs: "<prim>", rhs: ["i", "o"] },
                { lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"] },
                { lhs: "<prod>", rhs: ["[ <expr> <more> ]"] },
                { lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"] }
            ];
            const startSymbol = "<expr>";
            const grammar = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
            expect(grammar.listTerminals().map(token => token.toString())).toStrictEqual(terminals);
        });
    });
});
describe("listNonTerminals()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const nonTerminals = ["<expr>", "<prim>", "<comp>", "<more>", "<prod>"];
            const terminals = ["i", "o", "->", "[", "]", "(", ")", ","];
            const rules = [
                { lhs: "<expr>", rhs: ["<prim>", "<comp>"] },
                { lhs: "<prim>", rhs: ["i", "o"] },
                { lhs: "<comp>", rhs: ["<prim> -> <prim>", "( <comp> ) -> <prim>", "<prim> -> ( <comp> )", "( <comp> ) -> ( <comp> )", "<prod> -> <prim>", "<prod> -> ( <comp> )"] },
                { lhs: "<prod>", rhs: ["[ <expr> <more> ]"] },
                { lhs: "<more>", rhs: [", <expr>", ", <expr> <more>"] }
            ];
            const startSymbol = "<expr>";
            const grammar = Grammar_1.Grammar.fromStrings(nonTerminals, terminals, rules, startSymbol);
            expect(grammar.listNonTerminals().map(token => token.toString())).toStrictEqual(nonTerminals);
        });
    });
});
//# sourceMappingURL=Grammar.test.js.map