"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRuleParser = exports.ProductionRule = void 0;
const TokenString_1 = require("./TokenString");
const Utils_1 = require("./Utils");
const TokenTable_1 = require("./TokenTable");
const ParsingException_1 = require("./ParsingException");
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
    static fromString(lhs, rhs) {
        const tokenizedLhs = TokenString_1.TokenString.fromString(lhs);
        const tokenizedRhs = rhs.map(string => TokenString_1.TokenString.fromString(string));
        return new ProductionRule(tokenizedLhs, tokenizedRhs);
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
        return this.rhs.some(option => option.isEqual(TokenString_1.TokenString.fromString("")));
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
        //Correct, but unoptimized version
        const lhs = this.lhs;
        for (const option of this.rhs) {
            let foundCorrectSubstitution = false;
            for (let index = 0; index < lhs.size() && index < option.size(); index++) {
                const currentLhsToken = lhs.tokenAt(index);
                if (tokenTable[currentLhsToken.toString()] === TokenTable_1.TokenSort.NonTerminal) {
                    const oneAfterPivotIndex = index + 1;
                    const leftContext = lhs.slice(0, index);
                    const rightContext = lhs.slice(oneAfterPivotIndex);
                    if (option.startsWith(leftContext) &&
                        option.endsWith(rightContext)) {
                        foundCorrectSubstitution = true;
                        break;
                    }
                }
            }
            if (!foundCorrectSubstitution) {
                return false;
            }
        }
        return true && this.isMonotonic(tokenTable);
        //Optimized Version But Not Correct Yet
        // const lhs = this.lhs;
        // const rhs = this.rhs;
        // for(const option of rhs)
        // {
        //   //Must be monotonic
        //   if(lhs.size() > option.size())
        //   {
        //     return false;
        //   }
        //   const nonTerminalIndexes = [];
        //   let longestLeftContextSize = 0;
        //   let longestRightContextSize = 0; 
        //   for(let index = 0; index < lhs.size() - 1; index++)
        //   {
        //     const currentLhsToken = lhs.tokenAt(index);
        //     const currentOptionToken = option.tokenAt(index);
        //     if(tokenTable[currentLhsToken.toString()] === TokenSort.NonTerminal)
        //     {
        //       nonTerminalIndexes.push(index);
        //     }
        //     if(currentLhsToken.isEqual(currentOptionToken))
        //     {
        //       longestLeftContextSize++;
        //     }
        //     else
        //     {
        //       break;
        //     }
        //   }
        //   const rightmostScannedTokenIndex = longestLeftContextSize;
        //   for(let index = lhs.size() - 1; index > longestLeftContextSize; index--)
        //   {
        //     const currentLhsToken = lhs.tokenAt(index);
        //     const currentOptionToken = option.tokenAt(index);
        //     if(tokenTable[currentLhsToken.toString()] === TokenSort.NonTerminal)
        //     {
        //       nonTerminalIndexes.push(index);
        //     }
        //     if(currentLhsToken.isEqual(currentOptionToken))
        //     {
        //       longestRightContextSize++;
        //     }
        //     else
        //     {
        //       break;
        //     }
        //   }
        // }
    }
}
exports.ProductionRule = ProductionRule;
class ProductionRuleParser {
    // public static fromString(string : string) : ProductionRule
    // {
    //   const trimmedString = string.trim();
    //   if(trimmedString[0] !== `"`)
    //   {
    //     throw new ParsingException(`The first character is expected to be a '"' (quotation mark) that encloses the rule's left hand side token string!`, 0, 0, trimmedString);
    //   }
    //   const [lhsString, lhsRightQuotationMarkIndex] = this.extractQuotationMarkEnclosedSubstring(0, trimmedString);
    //   const rightArrowEndIndex = this.findRightArrowEndIndex(trimmedString, lhsRightQuotationMarkIndex + 1);
    //   //This is a very complex endeavor!
    //   let rhsStringList = [];
    // }
    // private static findQuotationMarkIndex(string : string, startIndex) : number
    // {
    // }
    // private static findRightArrowEndIndex(string : string, startIndex : number) : number
    // {
    //   let index = startIndex;
    //   while(true)
    //   {
    //     if(index === string.length)
    //     {
    //       throw new ParsingException(`String ended prematurely at the place where "->" was expected!`, index - 1, index - 1, string);
    //     }
    //     else if(string[index] === " ")
    //     {
    //       index++;
    //     }
    //     else if(string[index] === "-")
    //     {
    //       const rightArrowEndIndex = index + 1;
    //       if(rightArrowEndIndex === string.length)
    //       {
    //         throw new ParsingException(`String ended prematurely at the place where "->" was expected!`, index, index, string);
    //       }
    //       else if(string[rightArrowEndIndex] === ">")
    //       {
    //         return rightArrowEndIndex;
    //       }
    //       else
    //       {
    //         throw new ParsingException(`Found "${string[index]}${string[rightArrowEndIndex]}" where a "->" was expected!`, index, rightArrowEndIndex, string);
    //       }
    //     }
    //     else
    //     {
    //       throw new ParsingException(`Found "${string[index]}" where a "-" was expected!`, index, index, string);
    //     }
    //   }
    // }
    // private static extractQuotationMarkEnclosedSubstring(startIndex : number, string : string) : [string, number]
    // {
    //   if(string[startIndex] !== `"`)
    //   {
    //     throw new ParsingException(`Cannot find the substring enclosed by quotation mark because passed index (${startIndex}) does not correspond to a '"'!`, startIndex, startIndex, string);
    //   }
    //   try
    //   {
    //     // eslint-disable-next-line no-var
    //     var [endIndex] = this.findSubstringBeginIndex(string, `"`, startIndex);
    //   }
    //   catch(error)
    //   {
    //     throw new ParsingException(`Reached end of string and did not find the matching '"'!`, startIndex, endIndex, string);
    //   }
    //   const oneAfterLeftQuotationMarkIndex = startIndex + 1;
    //   const oneAfterRightQuotationMarkIndex = endIndex + 1;
    //   return [string.slice(oneAfterLeftQuotationMarkIndex, endIndex), oneAfterRightQuotationMarkIndex];
    // }
    /**
     * Returns the begin index of the first occurrence
     * of the substring in the searched string or throws an exception
     * if none was found.
     *
     * @param whereString
     * @param findString
     * @param startIndex
     */
    static findSubstringBeginIndex(whereString, findString, startIndex = 0) {
        const matchedCharactersGoal = findString.length;
        let matchedCharactersCount = 0;
        let whereStringIndex = startIndex;
        let findStringIndex = 0;
        while (true) {
            if (whereStringIndex === whereString.length) {
                throw new ParsingException_1.ParsingException(`Couldn't find substring ${findString} from index ${startIndex}!`, startIndex, whereString.length - 1, whereString);
            }
            else if (whereString[whereStringIndex] === findString[findStringIndex]) {
                matchedCharactersCount++;
                if (matchedCharactersCount === matchedCharactersGoal) {
                    const substringBeginIndex = whereStringIndex - findString.length + 1;
                    return substringBeginIndex;
                }
                findStringIndex++;
                whereStringIndex++;
            }
            else {
                findStringIndex = 0;
                whereStringIndex++;
            }
        }
    }
}
exports.ProductionRuleParser = ProductionRuleParser;
//# sourceMappingURL=ProductionRule.js.map