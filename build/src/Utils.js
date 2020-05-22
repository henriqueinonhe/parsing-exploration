"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
class Utils {
    static removeArrayDuplicates(array, equalityTest) {
        const arrayWithoutDuplicates = [];
        for (const elem of array) {
            if (arrayWithoutDuplicates.every(elem2 => !equalityTest(elem, elem2))) {
                arrayWithoutDuplicates.push(elem);
            }
        }
        return arrayWithoutDuplicates;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map