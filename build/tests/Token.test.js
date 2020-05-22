"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("../src/Token");
describe("constructor", () => {
    describe("Pre Conditions", () => {
        test("Token string validation", () => {
            expect(() => { new Token_1.Token(" "); }).toThrow("Invalid token string!");
            expect(() => { new Token_1.Token("\n"); }).toThrow("Invalid token string!");
            expect(() => { new Token_1.Token("     "); }).toThrow("Invalid token string!");
            expect(() => { new Token_1.Token(""); }).toThrow("Invalid token string!");
            expect(() => { new Token_1.Token("\t"); }).toThrow("Invalid token string!");
            expect(() => { new Token_1.Token("Asd"); }).not.toThrow();
            expect(() => { new Token_1.Token(";"); }).not.toThrow();
            expect(() => { new Token_1.Token("."); }).not.toThrow();
            expect(() => { new Token_1.Token("->"); }).not.toThrow();
            expect(() => { new Token_1.Token("-"); }).not.toThrow();
            expect(() => { new Token_1.Token("+"); }).not.toThrow();
            expect(() => { new Token_1.Token("="); }).not.toThrow();
            expect(() => { new Token_1.Token("a0s9djh3294nmasd"); }).not.toThrow();
        });
    });
    describe("Post Conditions", () => {
        test("Token string is set correctly during construction", () => {
            expect(new Token_1.Token("Jupiter").toString()).toBe("Jupiter");
            expect(new Token_1.Token("da9duna890dn").toString()).toBe("da9duna890dn");
            expect(new Token_1.Token("DMIad9s9auj3").toString()).toBe("DMIad9s9auj3");
            expect(new Token_1.Token("aaaaaaaaa").toString()).toBe("aaaaaaaaa");
        });
    });
});
//# sourceMappingURL=Token.test.js.map