'use strict'
//npm i @types/elasticsearch
//npm i @elastic/elasticsearch
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'
import { runInContext } from 'vm';
import { individuo } from './individuo';


export class httpR{
    private client = new Client({ node: 'http://localhost:9200' })
    private index = 'sample2';
    httpR(){
    }
    //indexando documentos
    public async uploadIndex (body:string):Promise<void>{
        // Let's start by indexing some data
        const doc1: RequestParams.Index = {
            index: this.index,
            body
        }
        this.client.index(doc1);
    }

    

    public search(valor1:number,valor2:number,busqueda:string){
        // Let's search!
        const params: RequestParams.Search = {
            index: this.index,
            body: {
                query: {
                    bool:{
                        should:[
                            {term:{tipo:busqueda}},
                            {range:{final:{lte:valor2}}},
                            {range:{inicio:{lte:valor1}}}
                        ],
                        minimum_should_match : 2,
                    }
                }
            }
        }
    this.client
        .search(params)
        .then((result: ApiResponse) => {
        var resultado: any = result.body.hits.hits;
        console.log(resultado[0]);
        })
        .catch((err: Error) => {
             console.log(err);
        })
    }
}
