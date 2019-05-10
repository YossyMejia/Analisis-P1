'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//npm i @types/elasticsearch
//npm i @elastic/elasticsearch
const elasticsearch_1 = require("@elastic/elasticsearch");
class httpR {
    constructor() {
        this.client = new elasticsearch_1.Client({ node: 'http://localhost:9200' });
        this.index = 'sample2';
    }
    httpR() {
    }
    //indexando documentos
    uploadIndex(body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Let's start by indexing some data
            const doc1 = {
                index: this.index,
                body
            };
            this.client.index(doc1);
        });
    }
    search(valor1, valor2, busqueda) {
        // Let's search!
        const params = {
            index: this.index,
            body: {
                query: {
                    bool: {
                        should: [
                            { term: { tipo: busqueda } },
                            { range: { final: { lte: valor2 } } },
                            { range: { inicio: { lte: valor1 } } }
                        ],
                        minimum_should_match: 2,
                    }
                }
            }
        };
        this.client
            .search(params)
            .then((result) => {
            var resultado = result.body.hits.hits;
            console.log(resultado[0]);
        })
            .catch((err) => {
            console.log(err);
        });
    }
}
exports.httpR = httpR;
//# sourceMappingURL=httpR.js.map