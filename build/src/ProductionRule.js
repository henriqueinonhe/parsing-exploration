"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRule = void 0;
var TokenString_1 = require("./TokenString");
var ProductionRule = /** @class */ (function () {
    function ProductionRule(lhs, rhs) {
        var tokenStringLhs = new TokenString_1.TokenString(lhs);
        var tokenStringRhs = rhs.map(function (string) { return new TokenString_1.TokenString(string); });
        ProductionRule.validateLhs(tokenStringLhs);
        ProductionRule.validateRhs(tokenStringRhs);
        var rhsWithoutDuplicates = ProductionRule.removeRhsDuplicates(tokenStringRhs);
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
    ProductionRule.removeRhsDuplicates = function (rhs) {
        var rhsWithoutDuplicates = [];
        var _loop_1 = function (tokenString) {
            if (!rhsWithoutDuplicates.some(function (elem) { return elem.isEqual(tokenString); })) {
                rhsWithoutDuplicates.push(tokenString);
            }
        };
        for (var _i = 0, rhs_1 = rhs; _i < rhs_1.length; _i++) {
            var tokenString = rhs_1[_i];
            _loop_1(tokenString);
        }
        return rhsWithoutDuplicates;
    };
    ProductionRule.prototype.getLhs = function () {
        return this.lhs;
    };
    ProductionRule.prototype.getRhs = function () {
        return this.rhs;
    };
    return ProductionRule;
}());
exports.ProductionRule = ProductionRule;
//# sourceMappingURL=ProductionRule.js.map