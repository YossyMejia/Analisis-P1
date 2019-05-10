"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DISTANCE_CHORS = 400;
class chors {
    constructor(pSong) {
        this.song = pSong;
    }
    dynamicNormalize() {
        this.normalize(this.song, DISTANCE_CHORS, 0);
    }
    normalize(pSong, pDistance, pIndex) {
        // hago el analisis de 3 notas para armar acorde
        // modifico el nuevo indice en pIndex
        this.normalize(pSong, pDistance, pIndex);
    }
}
exports.chors = chors;
//# sourceMappingURL=dynamic-chors.js.map