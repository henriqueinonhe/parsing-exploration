"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/**
 * Represents a Token that will compose a TokenString.
 */
class Token {
    constructor(tokenString) {
        Token.validateTokenString(tokenString);
        this.tokenString = tokenString;
    }
    /**
     * Valiates token string, making sure it is not a whitespace character.
     *
     * @param tokenString
     */
    static validateTokenString(tokenString) {
        const validTokenStringRegex = /^\S+$/;
        if (!validTokenStringRegex.test(tokenString)) {
            throw new Error("Invalid token string!");
        }
    }
    toString() {
        return this.tokenString;
    }
    isEqual(other) {
        return other instanceof Token &&
            this.toString() === other.toString();
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map