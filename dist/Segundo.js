"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Segundo {
    constructor(segundo, tasaDeVariacion, subidas, bajadas, llanos) {
        this.segundo = segundo;
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
    getSegundos() {
        return this.segundo;
    }
}
exports.Segundo = Segundo;
//# sourceMappingURL=Segundo.js.map