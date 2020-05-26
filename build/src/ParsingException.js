"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsingException = void 0;
const LogosUtils_1 = require("./LogosUtils");
/**
 * Exception used to singal and describe an error that
 * occurred during parser, due to failing to parse a
 * malformed sentence.
 *
 * The core functionality of this exception is that
 * it gathers information about string character indexes
 * where the error was found.
 *
 * It carries a message that is suited for the CLI.
 */
class ParsingException extends Error {
    /**
     * Sets Error's message as the CLI-compatible error
     * message, including the explanation, the token string and
     * the highlight.
     *
     * @param explanation
     * @param errorBeginIndex
     * @param errorEndIndex
     * @param tokenString
     */
    constructor(explanation, errorBeginIndex, errorEndIndex, tokenString) {
        ParsingException.validateParameters(errorBeginIndex, errorEndIndex, tokenString);
        const highlight = ParsingException.renderHighlight(tokenString.length, errorBeginIndex, errorEndIndex);
        super(`${explanation}\n${tokenString}\n${highlight}`);
        this.explanation = explanation;
        this.errorBeginIndex = errorBeginIndex;
        this.errorEndIndex = errorEndIndex;
        this.tokenString = tokenString;
    }
    /**
     * Enforces class invariants, making sure
     * that indexes are within bounds regarding
     * token string and that they don't "cross".
     *
     * @param errorBeginIndex
     * @param errorEndIndex
     * @param tokenString
     */
    static validateParameters(errorBeginIndex, errorEndIndex, tokenString) {
        LogosUtils_1.validateIndex(errorBeginIndex, "errorBeginIndex");
        LogosUtils_1.validateIndex(errorEndIndex, "errorEndIndex");
        if (errorEndIndex >= tokenString.length) {
            throw new LogosUtils_1.LogicErrorException(`errorEndIndex is expected to be < tokenString length (${tokenString.length}), but ${errorEndIndex} was passed instead.`);
        }
        if (errorBeginIndex > errorEndIndex) {
            throw new LogosUtils_1.LogicErrorException(`errorBeginIndex is expected to be <= errorEndIndex but ${errorBeginIndex} and ${errorEndIndex} were passed instead.`);
        }
    }
    /**
     * Renders a highlight using "^" to indicate
     * where the problems are in the string.
     *
     * @param stringSize
     * @param errorBeginIndex
     * @param errorEndIndex
     */
    static renderHighlight(stringSize, errorBeginIndex, errorEndIndex) {
        /**
         * Regarding sizes: startPad + highLight + endPad = stringSize, therefore
         * endPad = stringSize - highlight - startPad =
         * stringSize - (errorEndIndex - errorBeginIndex + inclusiveEndIndexCompensation) - errorBeginIndex =
         * stringSize - errorEndIndex - inclusiveEndIndexCompensation.
         */
        const startPad = " ".repeat(errorBeginIndex);
        const inclusiveEndIndexCompensation = 1;
        const highlight = "^".repeat(errorEndIndex - errorBeginIndex + inclusiveEndIndexCompensation);
        const endPad = " ".repeat(stringSize - errorEndIndex - inclusiveEndIndexCompensation);
        return `${startPad}${highlight}${endPad}`;
    }
    /**
     * Gets the explanation.
     */
    getExplanation() {
        return this.explanation;
    }
    /**
     * Gets the error begin index.
     */
    getErrorBeginIndex() {
        return this.errorBeginIndex;
    }
    /**
     * Gets the error end index.
     */
    getErrorEndIndex() {
        return this.errorEndIndex;
    }
    /**
     * Gets the error associated token string.
     */
    getTokenString() {
        return this.tokenString;
    }
    /**
     * Gets complete error message.
     */
    getErrorMessage() {
        return this.message;
    }
}
exports.ParsingException = ParsingException;
//# sourceMappingURL=ParsingException.js.map