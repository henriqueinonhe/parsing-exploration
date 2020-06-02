"use strict";
/**
 * File Status
 * Refactoring: HIGH
 * Documentation: HIGH
 * Testing: HIGH
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenString = void 0;
const Token_1 = require("./Token");
const LogosUtils_1 = require("./LogosUtils");
/**
 * Represents a sequence of tokens.
 *
 * Used as strings in the parsing environment.
 */
class TokenString {
    constructor(tokenList) {
        this.tokenList = tokenList;
    }
    /**
     * Lexes a given string, breaking it into
     * tokens.
     *
     * Whitespace is used as token separator.
     *
     * @param string
     * @returns Token list
     */
    static lex(string) {
        const substringList = string.split(/ +/);
        const noEmptyPartsSubstringList = substringList.filter(substring => substring !== "");
        const tokenList = noEmptyPartsSubstringList.map(substring => new Token_1.Token(substring));
        return tokenList;
    }
    /**
     * Alternative constructor that uses
     * a string as argument instead of a token list.
     *
     * It builds a token string by lexing the
     * given string.
     *
     * @param string
     */
    static fromString(string) {
        return new TokenString(TokenString.lex(string));
    }
    /**
     * Returns internal token list.
     */
    getTokenList() {
        return this.tokenList;
    }
    /**
     * Returns token at a given index.
     *
     * @param index
     */
    tokenAt(index) {
        LogosUtils_1.validateIndex(index, "index", this.tokenList.length, "tokenList");
        return this.tokenList[index];
    }
    /**
     * Returns string representation of the token list.
     */
    toString() {
        return this.tokenList.reduce((string, token) => string += " " + token.toString(), "").trim();
    }
    /**
     * Checks if the string is empty, that is,
     * contains no tokens.
     */
    isEmpty() {
        return this.tokenList.length === 0;
    }
    /**
     * Deep equality check.
     *
     * @param other
     */
    isEqual(other) {
        return other instanceof TokenString &&
            this.toString() === other.toString();
    }
    /**
     * Returns the number of tokens present
     * in the token string.
     */
    size() {
        return this.tokenList.length;
    }
    /**
     * TokenString equivalent of JS's
     * String slice.
     *
     * @param startIndex
     * @param endIndex
     */
    slice(startIndex, endIndex) {
        return new TokenString(this.tokenList.slice(startIndex, endIndex));
    }
    /**
     * TokenString equivalent of JS's
     * String startsWith.
     *
     * @param other
     */
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
    /**
     * TokenString equivalent of JS's
     * String endsWith.
     *
     * @param other
     */
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
    /**
     * TokenString equivalent of JS's Array
     * every.
     *
     * @param callbackfn
     * @param thisArg
     */
    every(callbackfn, thisArg /* This was "any" in the original declaration */) {
        return this.tokenList.every(callbackfn, thisArg);
    }
    /**
     * TokenString equivalent of JS's array
     * reduce.
     *
     * @param callbackfn
     * @param initialValue
     */
    reduce(callbackfn, initialValue) {
        return this.tokenList.reduce(callbackfn, initialValue);
    }
    /**
     * Deep copy.
     */
    clone() {
        return TokenString.fromString(this.toString());
    }
    /**
     * Checks whether a given tokenString is a substring
     * of this from a given index.
     *
     * @param tokenString
     * @param startIndex
     */
    includes(tokenString, startIndex = 0) {
        for (let index = startIndex; index < this.size(); index++) {
            if (this.slice(index, index + tokenString.size()).isEqual(tokenString)) {
                return true;
            }
        }
        return false;
    }
}
exports.TokenString = TokenString;
//# sourceMappingURL=TokenString.js.map