"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIndex = exports.LogicErrorException = exports.InvalidArgumentException = void 0;
/**
 * Exception used to signal that an invalid argument was given to a function,
 * that is, the argument is outside of the function's domain.
 */
class InvalidArgumentException extends Error {
    constructor(message) {
        super(`Invalid Argument!\n${message}`);
        this.type = "InvalidArgumentException";
    }
}
exports.InvalidArgumentException = InvalidArgumentException;
/**
 * Exception used to signal that a programming error occurred.
 */
class LogicErrorException extends Error {
    constructor(message) {
        super(`Logic Error!\n${message}`);
        this.type = "LogicErrorException";
    }
}
exports.LogicErrorException = LogicErrorException;
/**
 * Validates index candidates, to make sure they
 * are positive integers and if they are not,
 * throws an exception describing the problem and
 * incorporating a varibaleName.
 *
 * @param index
 * @param indexName The variable name to be incorporated in the error message
 */
function validateIndex(index, indexName = "index", arraySize = Infinity, arrayName = "array") {
    if (!Number.isInteger(index)) {
        throw new LogicErrorException(`${indexName} is expected to be an integer, but ${index} was passed instead!`);
    }
    if (index < 0) {
        throw new LogicErrorException(`${indexName} is expected to be a positive number, but ${index} was passed instead!`);
    }
    if (index >= arraySize) {
        throw new LogicErrorException(`There is no element associated with index ${index} in ${arrayName}`);
    }
}
exports.validateIndex = validateIndex;
//# sourceMappingURL=LogosUtils.js.map