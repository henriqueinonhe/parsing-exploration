"use strict";
/**
 * File Status
 * Refactoring: HIGH
 * Documentation: HIGH
 * Testing: HIGH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/**
 * Represents a token that is used to compose
 * [[TokenString]]s and that is treated as the
 * smallest lexical element in a parsing environment.
 *
 * A token encapsulates a string and
 * accepts any sequence of characters
 * that doesn't contain whitespaces or double quotation
 * marks.
 *
 */
class Token {
    constructor(tokenString) {
        Token.validateTokenString(tokenString);
        this.tokenString = tokenString;
    }
    /**
     * Validates token string.
     * It accepts as a string any sequence of
     * characters that doesn't contain whitespaces
     * or double quotation marks.
     *
     * @param tokenString
     */
    static validateTokenString(tokenString) {
        const validTokenStringRegex = /^[^\s"]+$/;
        if (!validTokenStringRegex.test(tokenString)) {
            throw new Error("Invalid token string!");
        }
    }
    /**
     * Returns encapsulated string.
     */
    toString() {
        return this.tokenString;
    }
    /**
     * Deep equality check.
     *
     * @param other
     */
    isEqual(other) {
        return other instanceof Token &&
            this.toString() === other.toString();
    }
    /**
     * Deep copy.
     */
    clone() {
        return new Token(this.toString());
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map