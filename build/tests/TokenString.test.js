"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenString_1 = require("../src/TokenString");
const Token_1 = require("../src/Token");
describe("toString()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.fromString("").toString()).toBe("");
            expect(TokenString_1.TokenString.fromString("Dobs").toString()).toBe("Dobs");
            expect(TokenString_1.TokenString.fromString("i -> o").toString()).toBe("i -> o");
            expect(TokenString_1.TokenString.fromString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
        });
    });
});
describe("isEmpty()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.fromString("").isEmpty()).toBe(true);
            expect(TokenString_1.TokenString.fromString("a").isEmpty()).toBe(false);
        });
    });
});
describe("isEqual()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.fromString("").isEqual(TokenString_1.TokenString.fromString(""))).toBe(true);
            expect(TokenString_1.TokenString.fromString(" as d").isEqual(TokenString_1.TokenString.fromString("a sd"))).toBe(false);
        });
    });
});
describe("slice()", () => {
    describe("Post Conditions", () => {
        test("One argument only", () => {
            expect(TokenString_1.TokenString.fromString("A B C   D   E").slice(0).isEqual(TokenString_1.TokenString.fromString("A B C D E"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("A B C D E").slice(3).isEqual(TokenString_1.TokenString.fromString("D E"))).toBe(true);
        });
    });
});
describe("startsWith()", () => {
    describe("Post Conditions", () => {
        test("Empty string", () => {
            expect(TokenString_1.TokenString.fromString("asdasd").startsWith(TokenString_1.TokenString.fromString(""))).toBe(true);
        });
        test("Happy path", () => {
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("y"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("y a"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("y a d d a"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("Y"))).toBe(false);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("y a d a"))).toBe(false);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("a d s a sd"))).toBe(false);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").startsWith(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a a a"))).toBe(false);
        });
    });
});
describe("endsWith()", () => {
    describe("Post Conditions", () => {
        test("Empty String", () => {
            expect(TokenString_1.TokenString.fromString("as da ds").endsWith(TokenString_1.TokenString.fromString(""))).toBe(true);
        });
        test("Default", () => {
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.fromString("Individual"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.fromString("Prop  -> Individual"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.fromString("Prop"))).toBe(false);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.fromString("asd asd a sd"))).toBe(false);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").endsWith(TokenString_1.TokenString.fromString("Prop -> Prop -> Prop -> Individual"))).toBe(false);
        });
    });
});
describe("clone()", () => {
    describe("Post Conditions", () => {
        test("Modifying clone doesn't affect original", () => {
            const original = TokenString_1.TokenString.fromString("A B C D");
            const clone = original.clone();
            clone.getTokenList()[0] = new Token_1.Token("DOBS");
            expect(clone.toString()).toBe("DOBS B C D");
            expect(original.toString()).toBe("A B C D");
        });
    });
});
describe("includes()", () => {
    describe("Post Conditions", () => {
        test("", () => {
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").includes(TokenString_1.TokenString.fromString("y"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").includes(TokenString_1.TokenString.fromString("y a"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").includes(TokenString_1.TokenString.fromString("y a d d a"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").includes(TokenString_1.TokenString.fromString("Individual"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").includes(TokenString_1.TokenString.fromString("Prop  -> Individual"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual").includes(TokenString_1.TokenString.fromString("Prop -> Prop -> Individual"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("A A B B A A").includes(TokenString_1.TokenString.fromString("A B B A"))).toBe(true);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").includes(TokenString_1.TokenString.fromString("a y"))).toBe(false);
            expect(TokenString_1.TokenString.fromString("y a d d a D u d a d a b a").includes(TokenString_1.TokenString.fromString("d a a a"))).toBe(false);
        });
    });
});
//# sourceMappingURL=TokenString.test.js.map