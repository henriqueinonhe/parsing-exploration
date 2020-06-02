"use strict";
/**
 * File Status
 * Refactoring: DONE
 * Documentation: DONE
 * Testing: DONE
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = exports.GrammarType = void 0;
const Token_1 = require("./Token");
const ProductionRule_1 = require("./ProductionRule");
const Utils_1 = require("./Utils");
const TokenTable_1 = require("./TokenTable");
const TokenString_1 = require("./TokenString");
/**
 * Represents the grammar type in the Chomsky
 * Hierarchy.
 *
 * The type indicates the most restrict
 * grammar class it belongs to.
 *
 * Type 0 -> Unrestricted Grammar
 * Type 1 -> Context Sensitive
 * Type 2 -> Context Free
 * Type 3 -> Regular
 */
var GrammarType;
(function (GrammarType) {
    GrammarType[GrammarType["Type0"] = 0] = "Type0";
    GrammarType[GrammarType["Type1"] = 1] = "Type1";
    GrammarType[GrammarType["Type2"] = 2] = "Type2";
    GrammarType[GrammarType["Type3"] = 3] = "Type3";
})(GrammarType = exports.GrammarType || (exports.GrammarType = {}));
/**
 * Represents a grammar, ready to be used
 * by parsers.
 */
class Grammar {
    constructor(tokenTable, rules, startSymbol) {
        Grammar.checkTokensInRulesAreInTokenTable(tokenTable, rules);
        Grammar.checkStartSymbolIsInTable(tokenTable, startSymbol);
        const mergedRules = Grammar.mergeRules(rules);
        this.tokenTable = tokenTable;
        this.rules = mergedRules;
        this.startSymbol = startSymbol;
    }
    /**
     * Given a list of terminals and non terminals,
     * checks whether the lists are disjunct, that is,
     * both lists have no common elements.
     *
     * @param nonTerminals
     * @param terminals
     */
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
    /**
     * Checks whether every token that occurs in each of
     * the [[ProductionRule]]s are present (declared either as a terminal
     * or a non terminal) in the [[TokenTable]].
     *
     * @param tokenTable
     * @param rules
     */
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
    /**
     * Initializes token table from non terminals and terminals
     * token lists.
     *
     * @param nonTerminals
     * @param terminals
     */
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
    /**
     * Checks whether the start symbol is
     * present (declared) in the [[TokenTable]].
     *
     * @param tokenTable
     * @param startSymbol
     */
    static checkStartSymbolIsInTable(tokenTable, startSymbol) {
        if (tokenTable[startSymbol.toString()] === undefined) {
            throw new Error(`Start symbol "${startSymbol.toString()}" is not present in the token table!`);
        }
    }
    /**
     * Merge rules, so if there are any
     * rules with the same left hand side,
     * their right hand sides are merged
     * together.
     *
     * @param rules
     */
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
    /**
     * Alternative constructor using strings.
     *
     * @param nonTerminals
     * @param terminals
     * @param rules
     * @param startSymbol
     */
    static constructFromStrings(nonTerminals, terminals, rules, startSymbol) {
        const tokenizedNonTerminals = nonTerminals.map(string => new Token_1.Token(string));
        const tokenizedTerminals = terminals.map(string => new Token_1.Token(string));
        Grammar.checkNonTerminalsAndTerminalsAreDisjunct(tokenizedNonTerminals, tokenizedTerminals);
        const tokenTable = Grammar.initializeTokenTable(tokenizedNonTerminals, tokenizedTerminals);
        const tokenizedRules = rules.map(rule => ProductionRule_1.ProductionRule.fromString(rule.lhs, rule.rhs));
        const tokenizedStartSymbol = new Token_1.Token(startSymbol);
        return new Grammar(tokenTable, tokenizedRules, tokenizedStartSymbol);
    }
    /**
     * Returns token table.
     */
    getTokenTable() {
        return this.tokenTable;
    }
    /**
     * Returns production rule list.
     */
    getRules() {
        return this.rules;
    }
    /**
     * Returns start symbol.
     */
    getStartSymbol() {
        return this.startSymbol;
    }
    /**
     * Returns whether every production rule in the
     * grammar is right regular.
     */
    isRightRegular() {
        return this.rules.every(rule => rule.isRightRegular(this.tokenTable));
    }
    /**
     * Returns whether every procution rule in the
     * grammar is left regular.
     */
    isLeftRegular() {
        return this.rules.every(rule => rule.isLeftRegular(this.tokenTable));
    }
    /**
     * Returns whether every production rule
     * in the grammar is context free.
     */
    isContextFree() {
        return this.rules.every(rule => rule.isContextFree(this.tokenTable));
    }
    /**
     * Returns whether every production rule
     * in the grammar is context sensitive.
     *
     */
    isContextSensitive() {
        return this.rules.every(rule => rule.isContextSensitive(this.tokenTable));
    }
    /**
     * Returns whether the grammar
     * has any E rules.
     */
    hasERules() {
        return this.rules.some(rule => rule.isERule(this.tokenTable));
    }
    /**
     * Returns the grammar type.
     */
    type() {
        if (this.isRightRegular() || this.isLeftRegular()) {
            return GrammarType.Type3;
        }
        else if (this.isContextFree()) {
            return GrammarType.Type2;
        }
        else if (this.isContextSensitive()) {
            return GrammarType.Type1;
        }
        else {
            return GrammarType.Type0;
        }
    }
    /**
     * Returns the [[ProductionRule]] whose left hand side
     * corresponds to the string passed.
     *
     * If there is no such rule, returns undefined.
     *
     * @param lhs
     */
    queryRule(lhs) {
        return this.rules.find(elem => elem.getLhs().isEqual(lhs));
    }
    /**
     * Returns whether the grammar has
     * Chomsky Normal Form, that is, let "A", "B"
     * and "C" be non terminals, "a" a terminal, "E"
     * the empty string and "S" the start symbol.
     *
     * All production rules must have the form:
     *
     * A -> BC
     * A -> a
     * S -> E
     */
    hasChomskyNormalForm() {
        const tokenTable = this.tokenTable;
        const startSymbol = this.startSymbol;
        return this.rules.every(rule => {
            return rule.getLhs().size() === 1 &&
                tokenTable[rule.getLhs().tokenAt(0).toString()] === TokenTable_1.TokenSort.NonTerminal &&
                rule.getRhs().every(option => {
                    return (option.size() === 2 && option.every(token => tokenTable[token.toString()] === TokenTable_1.TokenSort.NonTerminal)) ||
                        (option.size() === 1 && tokenTable[option.tokenAt(0).toString()] === TokenTable_1.TokenSort.Terminal) ||
                        (rule.getLhs().tokenAt(0).isEqual(startSymbol) && option.isEqual(TokenString_1.TokenString.fromString("")));
                });
        });
    }
    /**
       * Returns the rule whose left hand side
       * corresponds to the starting symbol, if there is any
       * and undefined otherwise.
       */
    getStartingRule() {
        return this.getRules().find(rule => rule.getLhs().tokenAt(0).isEqual(this.getStartSymbol()) && rule.getLhs().size() === 1);
    }
}
exports.Grammar = Grammar;
//# sourceMappingURL=Grammar.js.map