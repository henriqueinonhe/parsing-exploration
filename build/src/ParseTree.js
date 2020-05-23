"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTree = void 0;
const ParseTreeNode_1 = require("./ParseTreeNode");
const Token_1 = require("./Token");
class ParseTree {
    constructor(token) {
        this.root = new ParseTreeNode_1.ParseTreeNode(this, null, token);
    }
    static constructFromString(string) {
        return new ParseTree(new Token_1.Token(string));
    }
    getRoot() {
        return this.root;
    }
}
exports.ParseTree = ParseTree;
//# sourceMappingURL=ParseTree.js.map