"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/**
 * Represents a Token that will compose a TokenString.
 */
var Token = /** @class */ (function () {
    function Token(tokenString) {
        Token.validateTokenString(tokenString);
        this.tokenString = tokenString;
    }
    /**
     * Valiates token string, making sure it is not a whitespace character.
     *
     * @param tokenString
     */
    Token.validateTokenString = function (tokenString) {
        var validTokenStringRegex = /^\S+$/;
        if (!validTokenStringRegex.test(tokenString)) {
            throw new Error("Invalid token string!");
        }
    };
    Token.prototype.toString = function () {
        return this.tokenString;
    };
    Token.prototype.isEqual = function (other) {
        return other instanceof Token &&
            this.toString() === other.toString();
    };
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=Token.js.map