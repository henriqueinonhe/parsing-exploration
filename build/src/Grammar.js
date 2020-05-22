"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
const Token_1 = require("./Token");
const ProductionRule_1 = require("./ProductionRule");
const Utils_1 = require("./Utils");
const TokenTable_1 = require("./TokenTable");
class Grammar {
    constructor(nonTerminals, terminals, rules, startSymbol) {
        if (nonTerminals.length === 0) {
            throw new Error("Non terminals list is empty!");
        }
        if (terminals.length === 0) {
            throw new Error("Terminals list is empty!");
        }
        Grammar.checkNonTerminalsAndTerminalsAreDisjunct(nonTerminals, terminals);
        const tokenTable = Grammar.initializeTokenTable(nonTerminals, terminals);
        Grammar.checkTokensInRulesAreInTokenTable(tokenTable, rules);
        Grammar.checkStartSymbolIsInTable(tokenTable, startSymbol);
        const mergedRules = Grammar.mergeRules(rules);
        this.tokenTable = tokenTable;
        this.rules = mergedRules;
        this.startSymbol = startSymbol;
    }
    static checkNonTerminalsAndTerminalsAreDisjunct(nonTerminals, terminals) {
        const duplicates = [];
        for (const nonTerminal of nonTerminals) {
            if (terminals.some(terminal => terminal.isEqual(nonTerminal))) {
                duplicates.push(nonTerminal);
            }
        }
        if (duplicates.length !== 0) {
            const duplicatesStringList = duplicates.map(elem => elem.toString());
            throw new Error(`Tokens "${duplicatesStringList.join(`", "`)}" appear both as terminals and non terminals!`);
        }
    }
    static checkTokensInRulesAreInTokenTable(tokenTable, rules) {
        const everyTokenInProductionRules = rules.reduce((tokenList, rule) => tokenList.concat(rule.everyTokenList()), []);
        const ruleTokenNotInTable = [];
        for (const ruleToken of everyTokenInProductionRules) {
            if (tokenTable[ruleToken.toString()] === undefined) {
                ruleTokenNotInTable.push(ruleToken);
            }
        }
        const ruleTokenNotInTableWithoutDuplicates = Utils_1.Utils.removeArrayDuplicates(ruleTokenNotInTable, (token1, token2) => token1.isEqual(token2));
        if (ruleTokenNotInTableWithoutDuplicates.length !== 0) {
            const stringnizedTokensNotFound = ruleTokenNotInTableWithoutDuplicates.map(token => token.toString());
            throw new Error(`The following tokens were found in production rules but are not declared either as non terminals or terminals: "${stringnizedTokensNotFound.join(`", "`)}"!`);
        }
    }
    static initializeTokenTable(nonTerminals, terminals) {
        const tokenTable = {};
        for (const nonTerminal of nonTerminals) {
            tokenTable[nonTerminal.toString()] = TokenTable_1.TokenSort.NonTerminal;
        }
        for (const terminal of terminals) {
            tokenTable[terminal.toString()] = TokenTable_1.TokenSort.Terminal;
        }
        return tokenTable;
    }
    static checkStartSymbolIsInTable(tokenTable, startSymbol) {
        if (tokenTable[startSymbol.toString()] === undefined) {
            throw new Error(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
        }
    }
    static mergeRules(rules) {
        const mergedRules = [];
        loop: for (const rule of rules) {
            for (let index = 0; index < mergedRules.length; index++) {
                const mergedRule = mergedRules[index];
                if (rule.getLhs().isEqual(mergedRule.getLhs())) {
                    mergedRules[index] = rule.mergeRule(mergedRule);
                    continue loop; //In the mergedRules array there will be at most 1 rule with a given lhs at all times
                }
            }
            mergedRules.push(rule);
        }
        return mergedRules;
    }
    static constructFromStrings(nonTerminals, terminals, rules, startSymbol) {
        const tokenizedNonTerminals = nonTerminals.map(string => new Token_1.Token(string));
        const tokenizedTerminals = terminals.map(string => new Token_1.Token(string));
        const tokenizedRules = rules.map(rule => ProductionRule_1.ProductionRule.constructFromString(rule.lhs, rule.rhs));
        const tokenizedStartSymbol = new Token_1.Token(startSymbol);
        return new Grammar(tokenizedNonTerminals, tokenizedTerminals, tokenizedRules, tokenizedStartSymbol);
    }
    getTokenTable() {
        return this.tokenTable;
    }
    getRules() {
        return this.rules;
    }
    getStartSymbol() {
        return this.startSymbol;
    }
}
exports.Grammar = Grammar;
//# sourceMappingURL=Grammar.js.map