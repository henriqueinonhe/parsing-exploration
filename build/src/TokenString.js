"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenString = void 0;
var Token_1 = require("./Token");
/**
 * Represents a token string that will be used for parsing.
 */
var TokenString = /** @class */ (function () {
    function TokenString(string) {
        this.tokenList = TokenString.lex(string);
    }
    TokenString.lex = function (string) {
        var substringList = string.split(/ +/);
        var noEmptyPartsSubstringList = substringList.filter(function (substring) { return substring !== ""; });
        var tokenList = noEmptyPartsSubstringList.map(function (substring) { return new Token_1.Token(substring); });
        return tokenList;
    };
    /**
     * Returns string representation of the token list,
     * like a detonekization process.
     */
    TokenString.prototype.toString = function () {
        return this.tokenList.reduce(function (string, token) { return string += " " + token.toString(); }, "").trim();
    };
    TokenString.prototype.getTokenList = function () {
        return this.tokenList;
    };
    /**
     * Checks if the string is empty, that is, contains no tokens.
     */
    TokenString.prototype.isEmpty = function () {
        return this.tokenList.length === 0;
    };
    TokenString.prototype.isEqual = function (other) {
        return other instanceof TokenString &&
            this.toString() === other.toString();
    };
    return TokenString;
}());
exports.TokenString = TokenString;
//# sourceMappingURL=TokenString.js.map