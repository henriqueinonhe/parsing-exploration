"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTreeIterator = void 0;
class ParseTreeIterator {
    constructor(tree) {
        this.currentNode = tree.getRoot();
    }
    goToParent() {
        if (this.currentNode.isRoot()) {
            throw new Error("Cannot go to parent, for this node is root!");
        }
        this.currentNode = this.currentNode.getParent();
    }
    goToNthChild(index) {
        if (index >= this.currentNode.getChildren().length) {
            throw new Error(`You tried to access a non existent child!`);
        }
        this.currentNode = this.currentNode.getChildren()[index];
    }
    goToRoot() {
        this.currentNode = this.currentNode.getTree().getRoot();
    }
}
exports.ParseTreeIterator = ParseTreeIterator;
//# sourceMappingURL=ParseTreeIterator.js.map