"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("../src/Grammar");
const UngersEFreeRecognizer_1 = require("../src/UngersEFreeRecognizer");
const TokenString_1 = require("../src/TokenString");
const nonTerminals = ["<expr>", "<digit>"];
const terminals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "*", "(", ")"];
const rules = [
    { lhs: "<expr>", rhs: ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"] },
    { lhs: "<digit>", rhs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }
];
const startSymbol = "<expr>";
const grammar = Grammar_1.Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol);
const recognizer = new UngersEFreeRecognizer_1.UngersEFreeRecognizer(grammar);
recognizer.recognizes(TokenString_1.TokenString.constructFromString("0"));
describe("recgonizes()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            const nonTerminals = ["<expr>", "<digit>"];
            const terminals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "*", "(", ")"];
            const rules = [
                { lhs: "<expr>", rhs: ["( <expr> + <expr> )", "( <expr> * <expr> )", "<digit>"] },
                { lhs: "<digit>", rhs: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }
            ];
            const startSymbol = "<expr>";
            const grammar = Grammar_1.Grammar.constructFromStrings(nonTerminals, terminals, rules, startSymbol);
            const recognizer = new UngersEFreeRecognizer_1.UngersEFreeRecognizer(grammar);
            expect(recognizer.recognizes(TokenString_1.TokenString.constructFromString("0"))).toBe(true);
            expect(recognizer.recognizes(TokenString_1.TokenString.constructFromString("( 7 + 4 )"))).toBe(true);
            expect(recognizer.recognizes(TokenString_1.TokenString.constructFromString("( ( 3 + 4 ) *  5 )"))).toBe(true);
        });
    });
});
//# sourceMappingURL=UngersEFreeRecognizer.test.js.map