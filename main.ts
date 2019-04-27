import {Segundo} from './Segundo';

import * as fs from 'fs';
// import { complex as fft } from 'fft';
import * as WavEncoder from 'wav-encoder';
// import { default as ft } from 'fourier-transform';
import * as WavDecoder from 'wav-decoder';


const parametros=process.argv.slice(2);
var rigthS1:number[]=[];
var leftS1:number[]=[];
var rigthS2:number[]=[];
var leftS2:number[]=[];

function cargarCanciones(filepath: string,rigth:number[],left:number[]){
    var content = fs.readFileSync(filepath);
    var wav = WavDecoder.decode.sync(content);
    for(var i=0; i<wav.channelData[0].length; i++) {
        rigth.push(wav.channelData[0][i]);
        left.push(wav.channelData[1][i]);
    } 
}

function cargarTodo(){
    if(parametros[0]!="dj"){
        cargarCanciones(parametros[1],rigthS1,leftS1);
        cargarCanciones(parametros[2],rigthS2,leftS2);
    }
    else{
        cargarCanciones(parametros[1],rigthS1,leftS1);
    }
    funcionSeleccionada();
}

cargarTodo();

function mostrar(m:number[]){
    var left:string="";
    var rigth:string="";
    for(var ii=0;ii<99;ii=ii+11){
      console.log(m[ii]);
      console.log(m[ii]) 
      console.log("------------------------");
    }
}  

function getRandom(min:number,max:number):number{
    return Math.floor(Math.random()*(max-min+1)+min);
}


function mapear(sucesiones:Segundo[]):{[k:number]:number[]}{
    var map:{[k:number]:number[]}={};
    for(var indice=0;indice<sucesiones.length;indice++){
        if(map[sucesiones[indice].getTasa()]==null){
            map[sucesiones[indice].getTasa()]=[indice+1];
        }else{
            map[sucesiones[indice].getTasa()].push(indice+1);
        }
    }
   
    return map; 
}

function sucesiones(cancion:number[]):Segundo[]{
    var punto:number=11;var valor1:number=0;var valor2:number=0;
    var tamanno:number=cancion.length-1;var sucesion:Segundo[]=[];

    var segundo:number = 0;var milisegundos:number = 0;
    var samples:number = 0;var tasaDeVariacionPorSample:number = 0;
    var tasaDeVariacionPorSegundo:number = 0;
    var subida:number = 0;var bajada:number = 0;var llano:number = 0;

    valor1=1-cancion[0];
    //valor2=1-cancion[getRandom(1,punto)];
    //console.log(tamanno);
    valor2=1-cancion[punto];
    while(punto<=tamanno){
        if(milisegundos==1000){
            segundo+=1;
            milisegundos = 0;
            //sucesion.push([Math.round(tasaDeVariacionPorSegundo),subida,bajada,llano]);
            sucesion.push(new Segundo(Math.round(tasaDeVariacionPorSegundo),subida,bajada,llano));
            console.log("Segundo: ",segundo," subidas: ",subida," llanos: ",llano," bajada: ",bajada," tasa de variacion total: ",tasaDeVariacionPorSegundo);
            subida =llano = bajada = tasaDeVariacionPorSegundo = 0;
        }else if(samples==4){
            milisegundos++;
            samples = 0;
        }else{
            tasaDeVariacionPorSample = valor1-valor2;
            if(tasaDeVariacionPorSample>0.01000000)
                subida++;
            else if(tasaDeVariacionPorSample<-0.01000000)
                bajada++;
            else
                llano++;
            tasaDeVariacionPorSegundo += Math.abs(tasaDeVariacionPorSample);
            valor1=valor2
            //valor2=1-cancion[getRandom(punto,punto+11)];
            valor2=1-cancion[punto];
            punto=punto+11;
            samples++;
        }
    }
    return sucesion;
}

function comparar(n1:number,n2:number){
    return n1-n2;
}

function matchSegundos(){
    var sucesionS1:Segundo[]=sucesiones(rigthS1);
    var sucesionS2:Segundo[]=sucesiones(rigthS2);
    var mapS1:{[k:number]:number[]}=mapear(sucesionS1);
    var listaDeS:number[][]=[];var listaEncoder:number[]=[];

    for(var sg in sucesionS2){
        listaDeS.push([]);
        for(var variacion=sucesionS2[sg].getTasa()-70;variacion<=sucesionS2[sg].getTasa()+70;variacion++){
            if(mapS1[variacion]!=null){
                var listaTmp:number[]=mapS1[variacion];
                var contTemp:number=0;
                for(let seg in listaTmp){
                    if(Math.abs(sucesionS2[sg].getSubida()-sucesionS1[listaTmp[seg]-1].getSubida())<=25){contTemp++;}
                    if(Math.abs(sucesionS2[sg].getBajadas()-sucesionS1[listaTmp[seg]-1].getBajadas())<=25){contTemp++;}
                    if(Math.abs(sucesionS2[sg].getLlanos()-sucesionS1[listaTmp[seg]-1].getLlanos())<=25){contTemp++;}
                    //console.log("->",listaTmp);                   
                    if(contTemp>=2){listaDeS[sg].push(listaTmp[seg]);listaEncoder.push(listaTmp[seg])}     
                    contTemp=0;               
                }
            }
        }
    }
    console.log(sucesionS2);
    console.log(mapS1);
    console.log(listaDeS);
    generarCancion(listaEncoder); 
}

function generarCancion(listaEncoder:number[]){
    listaEncoder.sort(comparar);
    console.log(listaEncoder);
    var temp:number[]=[];
    for(let pos in listaEncoder){
        var inicio=(listaEncoder[pos]-1)*44100;
        var final=(listaEncoder[pos])*44100
        for(inicio;inicio<=final;inicio++){
            temp.push(rigthS1[inicio]);
        }
    }
    
    var der=new Float32Array(temp);

    var wavEn=WavEncoder.encode.sync({sampleRate:44100,channelData:[der,der]});
    fs.writeFileSync("prueba.wav",new Buffer(wavEn));
}

function funcionSeleccionada(){
    switch(parametros[0]){
        case "mt":
            //cargar(parametros[1],my);
            console.log("Funcion mt");
            break;
        case "umt":
            console.log("Funcion umt");
            console.log("------------------------");
            //console.log(mapear(sucesiones(rigthS1)));
            matchSegundos();
            //formas();
            console.log("------------------------");
            //console.log(mapear(sucesiones(rigthS2)));
            break;
        case "dj":
            console.log("Funcion dj"); 
            break;
        case "cmp":
            console.log("Funcion cmp");
            break;
        default:
            console.log("Nada");
    }
}
