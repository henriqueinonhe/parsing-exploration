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
    /**
     * Lexes a given string splitting it into tokens.
     *
     * @param string
     */
    TokenString.lex = function (string) {
        return string.split(/ +/).map(function (substring) { return new Token_1.Token(substring); });
    };
    /**
     * Returns string representation of the token list,
     * like a detonekization process.
     */
    TokenString.prototype.toString = function () {
        //This final slice is to remove the first trailing whitespace
        return this.tokenList.reduce(function (string, token) { return string += " " + token.getTokenString(); }, "").trim();
    };
    return TokenString;
}());
exports.TokenString = TokenString;
//# sourceMappingURL=TokenString.js.map