"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTreeNode = void 0;
class ParseTreeNode {
    constructor(tree, parent, token) {
        this.tree = tree;
        this.parent = parent;
        this.children = [];
        this.token = token;
    }
    getTree() {
        return this.tree;
    }
    getParent() {
        return this.parent;
    }
    getChildren() {
        return this.children;
    }
    getToken() {
        return this.token;
    }
    appendChild(token) {
        this.children.push(new ParseTreeNode(this.tree, this, token));
        return this;
    }
    isRoot() {
        return this.parent === null;
    }
}
exports.ParseTreeNode = ParseTreeNode;
//# sourceMappingURL=ParseTreeNode.js.map