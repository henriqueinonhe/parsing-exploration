"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("../src/Token");
describe("constructor", function () {
    describe("Pre Conditions", function () {
        test("Token string validation", function () {
            expect(function () { new Token_1.Token(" "); }).toThrow("Invalid token string!");
            expect(function () { new Token_1.Token("\n"); }).toThrow("Invalid token string!");
            expect(function () { new Token_1.Token("     "); }).toThrow("Invalid token string!");
            expect(function () { new Token_1.Token(""); }).toThrow("Invalid token string!");
            expect(function () { new Token_1.Token("\t"); }).toThrow("Invalid token string!");
            expect(function () { new Token_1.Token("Asd"); }).not.toThrow();
            expect(function () { new Token_1.Token(";"); }).not.toThrow();
            expect(function () { new Token_1.Token("."); }).not.toThrow();
            expect(function () { new Token_1.Token("->"); }).not.toThrow();
            expect(function () { new Token_1.Token("-"); }).not.toThrow();
            expect(function () { new Token_1.Token("+"); }).not.toThrow();
            expect(function () { new Token_1.Token("="); }).not.toThrow();
            expect(function () { new Token_1.Token("a0s9djh3294nmasd"); }).not.toThrow();
        });
    });
    describe("Post Conditions", function () {
        test("Token string is set correctly during construction", function () {
            expect(new Token_1.Token("Jupiter").getTokenString()).toBe("Jupiter");
            expect(new Token_1.Token("da9duna890dn").getTokenString()).toBe("da9duna890dn");
            expect(new Token_1.Token("DMIad9s9auj3").getTokenString()).toBe("DMIad9s9auj3");
            expect(new Token_1.Token("aaaaaaaaa").getTokenString()).toBe("aaaaaaaaa");
        });
    });
});
//# sourceMappingURL=Token.test.js.map