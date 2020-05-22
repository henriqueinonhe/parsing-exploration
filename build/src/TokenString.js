"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenString = void 0;
const Token_1 = require("./Token");
/**
 * Represents a token string that will be used for parsing.
 */
class TokenString {
    constructor(tokenList) {
        this.tokenList = tokenList;
    }
    static lex(string) {
        const substringList = string.split(/ +/);
        const noEmptyPartsSubstringList = substringList.filter(substring => substring !== "");
        const tokenList = noEmptyPartsSubstringList.map(substring => new Token_1.Token(substring));
        return tokenList;
    }
    static constructFromString(string) {
        return new TokenString(TokenString.lex(string));
    }
    getTokenList() {
        return this.tokenList;
    }
    tokenAt(index) {
        return this.tokenList[index];
    }
    /**
     * Returns string representation of the token list,
     * like a detonekization process.
     */
    toString() {
        return this.tokenList.reduce((string, token) => string += " " + token.toString(), "").trim();
    }
    /**
     * Checks if the string is empty, that is, contains no tokens.
     */
    isEmpty() {
        return this.tokenList.length === 0;
    }
    isEqual(other) {
        return other instanceof TokenString &&
            this.toString() === other.toString();
    }
    size() {
        return this.tokenList.length;
    }
    slice(startIndex, endIndex) {
        return new TokenString(this.tokenList.slice(startIndex, endIndex));
    }
    startsWith(other) {
        for (let index = 0; index < other.size(); index++) {
            if (index >= this.size()) {
                return false;
            }
            if (!this.tokenAt(index).isEqual(other.tokenAt(index))) {
                return false;
            }
        }
        return true;
    }
    endsWith(other) {
        const zeroIndexBasedCompensation = 1;
        for (let count = 0; count < other.size(); count++) {
            const thisIndex = this.size() - count - zeroIndexBasedCompensation;
            const otherIndex = other.size() - count - zeroIndexBasedCompensation;
            if (thisIndex < 0) {
                return false;
            }
            if (!this.tokenAt(thisIndex).isEqual(other.tokenAt(otherIndex))) {
                return false;
            }
        }
        return true;
    }
    every(callbackfn, thisArg /* This was "any" in the original declaration */) {
        return this.tokenList.every(callbackfn, thisArg);
    }
}
exports.TokenString = TokenString;
//# sourceMappingURL=TokenString.js.map