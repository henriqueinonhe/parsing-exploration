"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRule = void 0;
const TokenString_1 = require("./TokenString");
const Utils_1 = require("./Utils");
const TokenTable_1 = require("./TokenTable");
class ProductionRule {
    constructor(lhs, rhs) {
        ProductionRule.validateLhs(lhs);
        ProductionRule.validateRhs(rhs);
        const rhsWithoutDuplicates = Utils_1.Utils.removeArrayDuplicates(rhs, (tokenString1, tokenString2) => tokenString1.isEqual(tokenString2));
        this.lhs = lhs;
        this.rhs = rhsWithoutDuplicates;
    }
    static validateLhs(lhs) {
        if (lhs.isEmpty()) {
            throw new Error("Left hand side of rule cannot be empty!");
        }
    }
    static validateRhs(rhs) {
        if (rhs.length === 0) {
            throw new Error("Right hand side of rule cannot be empty!");
        }
    }
    static constructFromString(lhs, rhs) {
        const tokenStringLhs = TokenString_1.TokenString.constructFromString(lhs);
        const tokenStringRhs = rhs.map(string => TokenString_1.TokenString.constructFromString(string));
        return new ProductionRule(tokenStringLhs, tokenStringRhs);
    }
    getLhs() {
        return this.lhs;
    }
    getRhs() {
        return this.rhs;
    }
    checkValidityWithinContext(tokenTable) {
        const missingTokens = [];
        for (const token of this.everyTokenList()) {
            if (tokenTable[token.toString()] === undefined) {
                missingTokens.push(token);
            }
        }
        if (missingTokens.length !== 0) {
            throw new Error(`This rule is not valid in the context of the given token table, because the following tokens are occur in the rule but are absent from the table: "${missingTokens.map(token => token.toString()).join(`", "`)}"!`);
        }
    }
    /**
     * Returns a list without duplicates of every token present
     * in lhs and rhs token lists.
     */
    everyTokenList() {
        //Maybe use a hash table to speed up things
        const tokenList = this.lhs.getTokenList().slice(); //Make copy
        for (const tokenString of this.rhs) {
            tokenList.push(...tokenString.getTokenList());
        }
        return Utils_1.Utils.removeArrayDuplicates(tokenList, (token1, token2) => token1.isEqual(token2));
    }
    mergeRule(other) {
        if (!this.getLhs().isEqual(other.getLhs())) {
            throw new Error(`Cannot merge rules as their left hand sides differ!
      "${this.getLhs().toString()}" !== "${other.getLhs().toString()}"`);
        }
        const thisRhs = this.getRhs();
        const otherRhs = other.getRhs();
        const mergedRhs = [...thisRhs];
        for (const option of otherRhs) {
            if (mergedRhs.every(elem => !elem.isEqual(option))) {
                mergedRhs.push(option);
            }
        }
        return new ProductionRule(this.getLhs(), mergedRhs);
    }
    isMonotonic(tokenTable) {
        this.checkValidityWithinContext(tokenTable);
        return this.rhs.every(option => option.size() >= this.lhs.size());
    }
    //FIXME!
    isERule(tokenTable) {
        this.checkValidityWithinContext(tokenTable);
        return this.rhs.length === 1 &&
            this.rhs[0].isEmpty();
    }
    isContextFree(tokenTable) {
        this.checkValidityWithinContext(tokenTable);
        return this.lhs.size() === 1 &&
            tokenTable[this.lhs.tokenAt(0).toString()] === TokenTable_1.TokenSort.NonTerminal;
    }
    isRightRegular(tokenTable) {
        this.checkValidityWithinContext(tokenTable);
        return this.isContextFree(tokenTable) &&
            this.rhs.every(option => option.slice(0, -1).every(token => tokenTable[token.toString()] === TokenTable_1.TokenSort.Terminal));
    }
    isLeftRegular(tokenTable) {
        this.checkValidityWithinContext(tokenTable);
        return this.isContextFree(tokenTable) &&
            this.rhs.every(option => option.slice(1).every(token => tokenTable[token.toString()] === TokenTable_1.TokenSort.Terminal));
    }
    isContextSensitive(tokenTable) {
        this.checkValidityWithinContext(tokenTable);
        //TODO
        const lhs = this.lhs;
        for (const option of this.rhs) {
            for (let index = 0; index < lhs.size() && index < option.size(); index++) {
                const currentLhsToken = lhs.tokenAt(index);
                const currentOptionToken = option.tokenAt(index);
                if (tokenTable[currentLhsToken.toString()] === TokenTable_1.TokenSort.NonTerminal) {
                    if (option.startsWith(lhs.slice(0, index)) &&
                        option.endsWith(lhs.slice(index + 1))) {
                        //Found correct substitution
                        break;
                    }
                }
                else {
                    if (!currentLhsToken.isEqual(currentOptionToken)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
exports.ProductionRule = ProductionRule;
//# sourceMappingURL=ProductionRule.js.map