"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
var Grammar = /** @class */ (function () {
    function Grammar(nonTerminals, terminals, rules, startSymbol) {
        var nonTerminalsWithoutDuplicates = Grammar.removeTokenDuplicates(nonTerminals);
        var terminalsWithoutDuplicates = Grammar.removeTokenDuplicates(terminals);
    }
    Grammar.removeTokenDuplicates = function (tokenList) {
        var tokenListWithoutDuplicates = [];
        var _loop_1 = function (token) {
            if (!tokenListWithoutDuplicates.some(function (elem) { return elem.isEqual(token); })) {
                tokenListWithoutDuplicates.push(token);
            }
        };
        for (var _i = 0, tokenList_1 = tokenList; _i < tokenList_1.length; _i++) {
            var token = tokenList_1[_i];
            _loop_1(token);
        }
        return tokenListWithoutDuplicates;
    };
    Grammar.checkTokenAppearsInTerminalsAndNonTerminals = function (nonTerminals, terminals) {
        var duplicates = [];
        var _loop_2 = function (nonTerminal) {
            if (terminals.some(function (terminal) { return terminal.isEqual(nonTerminal); })) {
                duplicates.push(nonTerminal);
            }
        };
        for (var _i = 0, nonTerminals_1 = nonTerminals; _i < nonTerminals_1.length; _i++) {
            var nonTerminal = nonTerminals_1[_i];
            _loop_2(nonTerminal);
        }
        if (duplicates.length !== 0) {
            var duplicatesStringList = duplicates.map(function (elem) { return elem.toString(); });
            throw new Error("Tokens \"" + duplicatesStringList.join("\",\"") + "\" appear both as terminals and non terminals!");
        }
    };
    Grammar.checkTokensInRulesAreClassifiedAsTerminalsOrNonTerminals = function (nonTerminals, terminals, rules) {
        var terminalsOrNonTerminals = nonTerminals.concat(terminals);
    };
    Grammar.validateParameters = function (nonTerminals, terminals, rules, startSymbol) {
        if (nonTerminals.length === 0) {
            throw new Error("Non terminals list is empty!");
        }
        if (terminals.length === 0) {
            throw new Error("Terminals list is empty!");
        }
    };
    return Grammar;
}());
exports.Grammar = Grammar;
//# sourceMappingURL=Grammar.js.map