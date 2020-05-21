"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.removeArrayDuplicates = function (array, equalityTest) {
        var arrayWithoutDuplicates = [];
        var _loop_1 = function (elem) {
            if (arrayWithoutDuplicates.every(function (elem2) { return !equalityTest(elem, elem2); })) {
                arrayWithoutDuplicates.push(elem);
            }
        };
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var elem = array_1[_i];
            _loop_1(elem);
        }
        return arrayWithoutDuplicates;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map