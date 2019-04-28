"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Segundo {
    constructor(tasaDeVariacion, subidas, bajadas, llanos) {
        this.tasaDeVariacion = tasaDeVariacion;
        this.subidas = subidas;
        this.bajadas = bajadas;
        this.llanos = llanos;
    }
    getTasa() {
        return this.tasaDeVariacion;
    }
    getSubida() {
        return this.subidas;
    }
    getBajadas() {
        return this.bajadas;
    }
    getLlanos() {
        return this.llanos;
    }
}
exports.Segundo = Segundo;
//# sourceMappingURL=Segundo.js.map