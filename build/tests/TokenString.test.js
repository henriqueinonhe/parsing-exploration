"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenString_1 = require("../src/TokenString");
describe("toString()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.constructFromString("").toString()).toBe("");
            expect(TokenString_1.TokenString.constructFromString("Dobs").toString()).toBe("Dobs");
            expect(TokenString_1.TokenString.constructFromString("i -> o").toString()).toBe("i -> o");
            expect(TokenString_1.TokenString.constructFromString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
        });
    });
});
describe("isEmpty()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.constructFromString("").isEmpty()).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("a").isEmpty()).toBe(false);
        });
    });
});
describe("isEqual()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.constructFromString("").isEqual(TokenString_1.TokenString.constructFromString(""))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString(" as d").isEqual(TokenString_1.TokenString.constructFromString("a sd"))).toBe(false);
        });
    });
});
describe("slice()", () => {
    describe("Post Conditions", () => {
        test("One argument only", () => {
            expect(TokenString_1.TokenString.constructFromString("A B C   D   E").slice(0).isEqual(TokenString_1.TokenString.constructFromString("A B C D E"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("A B C D E").slice(3).isEqual(TokenString_1.TokenString.constructFromString("D E"))).toBe(true);
        });
    });
});
describe("startsWith()", () => {
    describe("Post Conditions", () => {
        test("Empty string", () => {
            expect(TokenString_1.TokenString.constructFromString("asdasd").startsWith(TokenString_1.TokenString.constructFromString(""))).toBe(true);
        });
        test("Happy path", () => {
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("y"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("y a"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("y a d d a"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("Y"))).toBe(false);
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("y a d a"))).toBe(false);
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("a d s a sd"))).toBe(false);
            expect(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.constructFromString("y a d d a D u d a d a b a a a"))).toBe(false);
        });
    });
});
describe("endsWith()", () => {
    describe("Post Conditions", () => {
        test("Empty String", () => {
            expect(TokenString_1.TokenString.constructFromString("as da ds").endsWith(TokenString_1.TokenString.constructFromString(""))).toBe(true);
        });
        test("Default", () => {
            expect(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.constructFromString("Individual"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.constructFromString("Prop  -> Individual"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual"))).toBe(true);
            expect(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.constructFromString("Prop"))).toBe(false);
            expect(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.constructFromString("asd asd a sd"))).toBe(false);
            expect(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.constructFromString("Prop -> Prop -> Prop -> Individual"))).toBe(false);
        });
    });
});
//# sourceMappingURL=TokenString.test.js.map