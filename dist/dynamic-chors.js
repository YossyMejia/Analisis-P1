"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DISTANCE_CHORS = 400;
var chors = /** @class */ (function () {
    function chors(pSong) {
        this.song = pSong;
    }
    chors.prototype.dynamicNormalize = function () {
        this.normalize(this.song, DISTANCE_CHORS, 0);
    };
    chors.prototype.normalize = function (pSong, pDistance, pIndex) {
        // hago el analisis de 3 notas para armar acorde
        // modifico el nuevo indice en pIndex
        this.normalize(pSong, pDistance, pIndex);
    };
    return chors;
}());
exports.chors = chors;
//# sourceMappingURL=dynamic-chors.js.map