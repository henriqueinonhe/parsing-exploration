"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenString_1 = require("../src/TokenString");
describe("toString()", function () {
    describe("Post Conditions", function () {
        test("", function () {
            expect(new TokenString_1.TokenString("").toString()).toBe("");
            expect(new TokenString_1.TokenString("Dobs").toString()).toBe("Dobs");
            expect(new TokenString_1.TokenString("i -> o").toString()).toBe("i -> o");
            expect(new TokenString_1.TokenString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
        });
    });
});
describe("isEmpty()", function () {
    describe("Post Conditions", function () {
        test("", function () {
            expect(new TokenString_1.TokenString("").isEmpty()).toBe(true);
            expect(new TokenString_1.TokenString("a").isEmpty()).toBe(false);
        });
    });
});
describe("isEqual()", function () {
    describe("Post Conditions", function () {
        test("", function () {
            expect(new TokenString_1.TokenString("").isEqual(new TokenString_1.TokenString(""))).toBe(true);
            expect(new TokenString_1.TokenString(" as d").isEqual(new TokenString_1.TokenString("a sd"))).toBe(false);
        });
    });
});
//# sourceMappingURL=TokenString.test.js.map