"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class individuo {
    constructor(id) {
        this.bajadas = 0;
        this.subidas = 0;
        this.colinas = 0;
        this.llano = 0;
        this.meseta = 0;
        this.id = id;
    }
    añadirBajada() {
        this.bajadas++;
    }
    añadirSubida() {
        this.subidas++;
    }
    añadirColina() {
        this.colinas++;
    }
    añadirLlano() {
        this.llano++;
    }
    añadirMeseta() {
        this.meseta++;
    }
    obtenerPorcentajes() {
        console.log(this.bajadas);
        var formasTotales = this.bajadas + this.subidas + this.colinas + this.llano + this.meseta;
        this.bajadas = (this.bajadas / formasTotales) * 100;
        this.subidas = (this.subidas / formasTotales) * 100;
        this.colinas = (this.colinas / formasTotales) * 100;
        this.meseta = (this.meseta / formasTotales) * 100;
        this.llano = (this.bajadas / formasTotales) * 100;
    }
}
exports.individuo = individuo;
//# sourceMappingURL=individuo.js.map