"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class objetoMapa {
    //public creacion:number[][];
    constructor(pDuracion, pTipo) {
        this.duracion = pDuracion;
        this.tipoEfecto = pTipo;
        this.sample = [];
        //this.creacion=[[],[]];
    }
    setSmple(psample) {
        this.sample = psample;
    }
    verSample() {
        console.log(this.sample);
    }
    crearEfecto(creacion) {
        switch (this.tipoEfecto) {
            case 1:
                return this.efectoLoop(creacion);
            case 2:
                return this.efectoLR(creacion);
            default:
                return this.efectoSS(creacion);
        }
    }
    efectoLoop(creacion) {
        for (var cont = 0; cont < this.duracion; cont++) {
            for (var pos in this.sample[0]) {
                creacion[0].push(this.sample[0][pos]);
                creacion[1].push(this.sample[1][pos]);
            }
        }
        return creacion;
    }
    efectoLR(creacion) {
        var flag = true;
        for (var cont = 0; cont < this.duracion; cont++) {
            if (flag) {
                for (var pos in this.sample[0]) {
                    creacion[0].push(0);
                    creacion[1].push(this.sample[1][pos]);
                }
                flag = false;
            }
            else {
                for (var pos in this.sample[0]) {
                    creacion[0].push(this.sample[0][pos]);
                    creacion[1].push(0);
                }
                flag = true;
            }
        }
        return creacion;
    }
    efectoSS(creacion) {
        var flag = true;
        for (var cont = 0; cont < this.duracion; cont++) {
            if (flag) {
                for (var pos in this.sample[0]) {
                    creacion[0].push(this.sample[0][pos]);
                    creacion[1].push(this.sample[1][pos]);
                }
                flag = false;
            }
            else {
                for (var pos in this.sample[0]) {
                    creacion[0].push(0);
                    creacion[1].push(0);
                }
                flag = true;
            }
        }
        return creacion;
    }
}
exports.objetoMapa = objetoMapa;
class myMap {
    constructor(pTonadas) {
        this.matriz = [];
        this.tonadas = pTonadas;
        this.creacion = [[], []];
    }
    cargarEstructura() {
        this.matriz = [[new objetoMapa(5, 2), new objetoMapa(6, 1), new objetoMapa(4, 2)],
            [new objetoMapa(3, 3), new objetoMapa(2, 2), new objetoMapa(3, 1)],
            [new objetoMapa(4, 2), new objetoMapa(6, 1), new objetoMapa(5, 3)],
            [new objetoMapa(2, 1), new objetoMapa(3, 2), new objetoMapa(4, 3)],
            [new objetoMapa(6, 1), new objetoMapa(4, 3), new objetoMapa(3, 1)]];
    }
    setTonadas(pTonadas) {
        this.tonadas = pTonadas;
    }
    getRandom(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    asignarTonadas() {
        for (var fila = 0; fila < 5; fila++) {
            for (var columna = 0; columna < 3; columna++) {
                this.matriz[fila][columna].setSmple(this.tonadas[this.getRandom(0, 9)]);
                this.creacion = this.matriz[fila][columna].crearEfecto(this.creacion);
            }
        }
    }
    getCreacion() {
        return this.creacion;
    }
}
exports.myMap = myMap;
//# sourceMappingURL=myMapa.js.map