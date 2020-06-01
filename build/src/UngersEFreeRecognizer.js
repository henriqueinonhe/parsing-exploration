"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UngersEFreeRecognizer = void 0;
const TokenString_1 = require("./TokenString");
const TokenTable_1 = require("./TokenTable");
const Utils_1 = require("./Utils");
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
        else if (!this.matchSententialFormBeginning(sententialForm, inputSubstring) ||
            !this.matchSententialFormEnd(sententialForm, inputSubstring)) {
            return false;
        }
        else if (!this.matchSenentialFormTerminals(sententialForm, inputSubstring)) {
            return false;
        }
        const partitions = Utils_1.Utils.listPartitions(inputSubstring.getTokenList(), numberOfGroups);
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
    matchSententialFormBeginning(sententialForm, inputSubstring) {
        const tokenTable = this.grammar.getTokenTable();
        let index = 0;
        while (index < sententialForm.size() &&
            tokenTable[sententialForm.tokenAt(index).toString()] === TokenTable_1.TokenSort.Terminal) {
            index++;
        }
        return inputSubstring.startsWith(sententialForm.slice(0, index));
    }
    matchSententialFormEnd(sententialForm, inputSubstring) {
        const tokenTable = this.grammar.getTokenTable();
        let index = sententialForm.size() - 1;
        while (index >= 0 &&
            tokenTable[sententialForm.tokenAt(index).toString()] === TokenTable_1.TokenSort.Terminal) {
            index--;
        }
        return inputSubstring.endsWith(sententialForm.slice(index + 1));
    }
    matchSenentialFormTerminals(sententialForm, inputSubstring) {
        const tokenTable = this.grammar.getTokenTable();
        const sententialFormTerminalCountTable = {};
        for (let index = 0; index < sententialForm.size(); index++) {
            const currentToken = sententialForm.tokenAt(index);
            if (tokenTable[currentToken.toString()] === TokenTable_1.TokenSort.Terminal) {
                const currentTerminalCount = sententialFormTerminalCountTable[currentToken.toString()];
                if (currentTerminalCount === undefined) {
                    sententialFormTerminalCountTable[currentToken.toString()] = 1;
                }
                else {
                    sententialFormTerminalCountTable[currentToken.toString()]++;
                }
            }
        }
        const inputSubstringTerminalCountTable = {};
        for (let index = 0; index < inputSubstring.size(); index++) {
            const currentToken = inputSubstring.tokenAt(index);
            if (tokenTable[currentToken.toString()] === TokenTable_1.TokenSort.Terminal) {
                const currentTerminalCount = inputSubstringTerminalCountTable[currentToken.toString()];
                if (currentTerminalCount === undefined) {
                    inputSubstringTerminalCountTable[currentToken.toString()] = 1;
                }
                else {
                    inputSubstringTerminalCountTable[currentToken.toString()]++;
                }
            }
        }
        for (const currentSententialFormTerminalString in sententialFormTerminalCountTable) {
            const currentSententialFormTerminalCount = sententialFormTerminalCountTable[currentSententialFormTerminalString];
            const currentInputSubstringTerminalCount = inputSubstringTerminalCountTable[currentSententialFormTerminalString];
            if (currentInputSubstringTerminalCount === undefined ||
                currentSententialFormTerminalCount > currentInputSubstringTerminalCount) {
                return false;
            }
        }
        return true;
    }
}
exports.UngersEFreeRecognizer = UngersEFreeRecognizer;
//# sourceMappingURL=UngersEFreeRecognizer.js.map