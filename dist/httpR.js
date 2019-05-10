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
const client = new elasticsearch_1.Client({ node: 'http://localhost:9200' });
class httpR {
    httpR() {
    }
    //indexando documentos
    uploadIndex(json) {
        return __awaiter(this, void 0, void 0, function* () {
            // Let's start by indexing some data
            const doc1 = {
                index: 'sample2',
                body: {
                    inicio: 0.000030518509447574615,
                    final: 0.000030518509447574615,
                    tipo: 'SUBIDA'
                }
            };
            //console.log(doc1);
            yield client.index(doc1);
            const doc2 = {
                index: 'game-of-thrones',
                body: {
                    character: 'Daenerys Targaryen',
                    quote: 'I am the blood of the dragon.'
                }
            };
            //console.log(doc2);
            yield client.index(doc2);
            /*
            const doc3: RequestParams.Index = {
                index: 'game-of-thrones',
                // here we are forcing an index refresh,
                // otherwise we will not get any result
                // in the consequent search
                refresh: "true",
                body: {
                character: 'Tyrion Lannister',
                quote: 'A mind needs books like a sword needs a whetstone.'
                }
            }
            await client.index(doc3)*/
        });
    }
    request(json) {
        this.uploadIndex(json);
        this.search();
    }
    search() {
        // Let's search!
        var indexName = 'sample';
        var busqueda = "SUBIDA";
        const params = {
            index: indexName,
            body: {
                query: {
                    match: {
                        tipo: busqueda,
                    }
                }
            }
        };
        client
            .search(params)
            .then((result) => {
            console.log(result.body.hits.hits);
        })
            .catch((err) => {
            //console.log(err)
        });
    }
}
exports.httpR = httpR;
//# sourceMappingURL=httpR.js.map