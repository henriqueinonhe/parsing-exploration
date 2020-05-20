"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenString_1 = require("../src/TokenString");
describe("constructor", function () {
    describe("Post Conditions", function () {
        test("Lexing is performed corretly", function () {
            //expect(new TokenString("").toString()).toBe("");
            expect(new TokenString_1.TokenString("Dobs").toString()).toBe("Dobs");
            expect(new TokenString_1.TokenString("  Dobs  ").toString()).toBe("Dobs");
            expect(new TokenString_1.TokenString("i -> o").toString()).toBe("i -> o");
            expect(new TokenString_1.TokenString("i          ->        o").toString()).toBe("i -> o");
            expect(new TokenString_1.TokenString("Forall x Exists y P ( x ) -> P ( y )").toString()).toBe("Forall x Exists y P ( x ) -> P ( y )");
        });
    });
});
//# sourceMappingURL=TokenString.test.js.map