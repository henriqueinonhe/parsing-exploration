"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UngersEFreeRecognizer = void 0;
const TokenString_1 = require("./TokenString");
const Debug_1 = require("./Debug");
const TokenTable_1 = require("./TokenTable");
class UngersEFreeRecognizer {
    constructor(grammar) {
        this.grammar = grammar;
    }
    recognizes(inputString) {
        const startSymbol = this.grammar.getStartSymbol();
        return this.matchSententialForm(new TokenString_1.TokenString([startSymbol]), inputString);
    }
    matchSententialForm(sententialForm, inputSubstring) {
        //Generate partitions over sentential form tokens
        const numberOfGroups = sententialForm.size();
        if (numberOfGroups > inputSubstring.size()) {
            return false;
        }
        const partitions = Debug_1.listPartitions(inputSubstring.getTokenList(), numberOfGroups);
        //Try to match the rest
        return partitions.some(partition => {
            return partition.every((inputSubstringTokenList, index) => {
                return this.matchToken(new TokenString_1.TokenString([sententialForm.tokenAt(index)]), new TokenString_1.TokenString(inputSubstringTokenList));
            });
        });
    }
    matchToken(token, inputSubstring) {
        const tokenTable = this.grammar.getTokenTable();
        if (tokenTable[token.toString()] === TokenTable_1.TokenSort.Terminal) {
            return token.isEqual(inputSubstring);
        }
        else {
            const correspondingRule = this.grammar.queryRule(token);
            if (correspondingRule === undefined) {
                return false;
            }
            else {
                const rhs = correspondingRule.getRhs();
                return rhs.some(option => this.matchSententialForm(option, inputSubstring));
            }
        }
    }
}
exports.UngersEFreeRecognizer = UngersEFreeRecognizer;
//# sourceMappingURL=UngersEFreeRecognizer.js.map