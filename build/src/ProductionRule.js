"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRule = void 0;
var TokenString_1 = require("./TokenString");
var Utils_1 = require("./Utils");
var ProductionRule = /** @class */ (function () {
    function ProductionRule(lhs, rhs) {
        var tokenStringLhs = new TokenString_1.TokenString(lhs);
        var tokenStringRhs = rhs.map(function (string) { return new TokenString_1.TokenString(string); });
        ProductionRule.validateLhs(tokenStringLhs);
        ProductionRule.validateRhs(tokenStringRhs);
        var rhsWithoutDuplicates = Utils_1.Utils.removeArrayDuplicates(tokenStringRhs, function (tokenString1, tokenString2) { return tokenString1.isEqual(tokenString2); });
        this.lhs = tokenStringLhs;
        this.rhs = rhsWithoutDuplicates;
    }
    ProductionRule.validateLhs = function (lhs) {
        if (lhs.isEmpty()) {
            throw new Error("Left hand side of rule cannot be empty!");
        }
    };
    ProductionRule.validateRhs = function (rhs) {
        if (rhs.length === 0) {
            throw new Error("Right hand side of rule cannot be empty!");
        }
    };
    ProductionRule.prototype.getLhs = function () {
        return this.lhs;
    };
    ProductionRule.prototype.getRhs = function () {
        return this.rhs;
    };
    /**
     * Returns a list without duplicates of every token present
     * in lhs and rhs token lists.
     */
    ProductionRule.prototype.everyTokenList = function () {
        //Maybe use a hash table to speed up things
        var tokenList = this.lhs.getTokenList().slice();
        for (var _i = 0, _a = this.rhs; _i < _a.length; _i++) {
            var tokenString = _a[_i];
            tokenList.push.apply(tokenList, tokenString.getTokenList());
        }
        return Utils_1.Utils.removeArrayDuplicates(tokenList, function (token1, token2) { return token1.isEqual(token2); });
    };
    return ProductionRule;
}());
exports.ProductionRule = ProductionRule;
//# sourceMappingURL=ProductionRule.js.map