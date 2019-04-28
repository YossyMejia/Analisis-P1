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
var hashSubidas = new Map<number,Segundo[]>();
var hashLlanos = new Map<number,Segundo[]>();
var hashBajadas = new Map<number,Segundo[]>();

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

//Funcion que inicializa los hash para que tengan 4 keys 0,25,0,50,0,75 y 1 en los 3 distintos hash
function iniciarHash(){
    var porcentaje = 0.25;
    var arreglo:Segundo[] = [];
    for(let i=0;i<4;i++){
        hashSubidas.set(porcentaje,arreglo);
        hashLlanos.set(porcentaje,arreglo);
        hashBajadas.set(porcentaje,arreglo);
        porcentaje+=0.25;
    }
}

//Funcion que limpia los hash 
function limpiarHash(){
    hashBajadas.clear();
    hashLlanos.clear();
    hashSubidas.clear();
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

//Funcion que recive un porcentaje y lo redondea a 0.25,0.50,0.75 o 1
function redondear(porcentaje:number):number{
    if(porcentaje<=0.25){
        return 0.25;
    }
    else if(porcentaje>0.25&&porcentaje<=0.50){
        return 0.50;
    }
    else if(porcentaje>0.50&&porcentaje<=0.75){
        return 0.75;
    }
    else if(porcentaje>0.75){
        return 1;
    }
}

//Funcion que recive un objeto como parametro, luego busca el procentaje de subidas, bajadas y llanos e inserta el objeto con su 
//porcentaje correspondiente
function estructurarInformacion(segundito:Segundo){
    var formasTotales = segundito.getBajadas()+segundito.getLlanos()+segundito.getSubida();
    var porcentajeBajadas = segundito.getBajadas()/formasTotales;
    var porcentajeLlanos = segundito.getLlanos()/formasTotales;
    var porcentajeSubidas = segundito.getSubida()/formasTotales;
    porcentajeBajadas = redondear(porcentajeBajadas);
    porcentajeLlanos = redondear(porcentajeLlanos);
    porcentajeSubidas = redondear(porcentajeSubidas);
    var arregloBajadas = hashBajadas.get(porcentajeBajadas);
    arregloBajadas.push(segundito);
    hashBajadas.set(porcentajeBajadas,arregloBajadas);
    var arregloSubidas = hashSubidas.get(porcentajeSubidas);
    arregloSubidas.push(segundito);
    hashSubidas.set(porcentajeSubidas,arregloSubidas);
    var arregloLlanos = hashLlanos.get(porcentajeLlanos);
    arregloLlanos.push(segundito);
    hashLlanos.set(porcentajeLlanos,arregloLlanos);
}

function sucesiones(cancionCD:number[],cancionCI:number[]){
    var punto:number=11;var valor1:number=0;var valor2:number=0;
    var tamanno:number=cancionCD.length-1;

    var segundo:number = 0;
    var samples:number = 1;var tasaDeVariacionPorSample:number = 0;
    var tasaDeVariacionPorSegundo:number = 0;
    var subida:number = 0;var bajada:number = 0;var llano:number = 0;

    valor1=Math.abs(cancionCD[0])*Math.abs(cancionCI[0]);
    valor2=Math.abs(cancionCD[punto])*Math.abs(cancionCI[punto]);
    while(punto<=tamanno){
        if(samples%4000==0){
            samples = 1;
            segundo +=1;
            estructurarInformacion(new Segundo(Math.round(tasaDeVariacionPorSegundo),subida,bajada,llano));
            //console.log("Segundo: ",segundo," subidas: ",subida," llanos: ",llano," bajada: ",bajada," tasa de variacion total: ",tasaDeVariacionPorSegundo);
            subida = llano = bajada = tasaDeVariacionPorSegundo = 0;
        }
        else{
            tasaDeVariacionPorSample = valor1-valor2;
            if(tasaDeVariacionPorSample>0.01000000)
                subida++;
            else if(tasaDeVariacionPorSample<-0.01000000)
                bajada++;
            else
                llano++;
            tasaDeVariacionPorSegundo += Math.abs(tasaDeVariacionPorSample);
            valor1=valor2;
            punto+=11;
            valor2=Math.abs(cancionCD[punto])*Math.abs(cancionCI[punto]);
            samples++;
        }
    }
}

function comparar(n1:number,n2:number){
    return n1-n2;
}

function matchSegundos(){
    sucesiones(rigthS1,leftS1);
    sucesiones(rigthS2,leftS2);
    /*
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
                    if(contTemp>=2){listaDeS[sg].push(listaTmp[seg]);listaEncoder.push(listaTmp[seg])}     
                    contTemp=0;               
                }
            }
        }
    }
    //console.log(sucesionS2);
    //console.log(mapS1);
    //console.log(listaDeS);
    //generarCancion(listaEncoder); */
}

function generarCancion(listaEncoder:number[]){
    listaEncoder.sort(comparar);
    var tempCD:number[]=[];
    var tempCI:number[]=[];
    for(let pos in listaEncoder){
        var inicio=(listaEncoder[pos]-1)*44100;
        var final=(listaEncoder[pos])*44100
        for(inicio;inicio<=final;inicio++){
            tempCD.push(rigthS1[inicio]);
            tempCI.push(leftS1[inicio]);
        }
    }
    
    var der=new Float32Array(tempCD);
    var izq=new Float32Array(tempCI);
    var wavEn=WavEncoder.encode.sync({sampleRate:44100,channelData:[izq,der]});
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
            iniciarHash();
            matchSegundos();
            limpiarHash();
            console.log("------------------------");
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
//node dist/main.js umt b.wav sb.wav
