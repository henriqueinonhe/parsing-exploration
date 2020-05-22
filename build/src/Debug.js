"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductionRule_1 = require("./ProductionRule");
const TokenTable_1 = require("./TokenTable");
const tokenTable = {
    "S": TokenTable_1.TokenSort.NonTerminal,
    "A": TokenTable_1.TokenSort.NonTerminal,
    "a": TokenTable_1.TokenSort.Terminal,
    "b": TokenTable_1.TokenSort.Terminal
};
ProductionRule_1.ProductionRule.constructFromString("S", [""]).isContextSensitive(tokenTable);
//# sourceMappingURL=Debug.js.map