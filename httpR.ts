'use strict'
//npm i @types/elasticsearch
//npm i @elastic/elasticsearch
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch'
import { runInContext } from 'vm';
const client = new Client({ node: 'http://localhost:9200' })

export class httpR{
    httpR(){
    }
    
    //indexando documentos
    public async uploadIndex (json:string):Promise<void>{
        // Let's start by indexing some data
        const doc1: RequestParams.Index = {
            index: 'sample2',
            body:{
                inicio: 0.000030518509447574615,
                final: 0.000030518509447574615,
                tipo: 'SUBIDA'
            }
        }
        //console.log(doc1);
        await client.index(doc1)
        
        const doc2: RequestParams.Index = {
            index: 'game-of-thrones',
            body: {
            character: 'Daenerys Targaryen',
            quote: 'I am the blood of the dragon.'
            }
        }
        //console.log(doc2);
        await client.index(doc2)
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
    }

    public request(json:string){
        this.uploadIndex(json);
        this.search();
    }

    public search(){
        // Let's search!
        var indexName = 'sample';
        var busqueda = "SUBIDA";
        const params: RequestParams.Search = {
            index: indexName,
            body: {
            query: {
                match: {
                tipo: busqueda,
                }
            }
            }
        }
    client
        .search(params)
        .then((result: ApiResponse) => {
        console.log(result.body.hits.hits)
        })
        .catch((err: Error) => {
        //console.log(err)
        })
    }
}

