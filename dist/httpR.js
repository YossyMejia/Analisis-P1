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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // Let's start by indexing some data
        const doc1 = {
            index: 'game-of-thrones',
            body: {
                character: 'Ned Stark',
                quote: 'Winter is coming.'
            }
        };
        yield client.index(doc1);
        const doc2 = {
            index: 'game-of-thrones',
            body: {
                character: 'Daenerys Targaryen',
                quote: 'I am the blood of the dragon.'
            }
        };
        yield client.index(doc2);
        const doc3 = {
            index: 'game-of-thrones',
            // here we are forcing an index refresh,
            // otherwise we will not get any result
            // in the consequent search
            refresh: "true",
            body: {
                character: 'Tyrion Lannister',
                quote: 'A mind needs books like a sword needs a whetstone.'
            }
        };
        yield client.index(doc3);
        // Let's search!
        const params = {
            index: 'game-of-thrones',
            body: {
                query: {
                    match: {
                        quote: 'blood'
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
            console.log(err);
        });
    });
}
class httpR {
    httpR() {
    }
    request() {
        run();
    }
}
exports.httpR = httpR;
//# sourceMappingURL=httpR.js.map