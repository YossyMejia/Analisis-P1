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
var hashSubidasS1 = new Map<number,Segundo[]>();
var hashLlanosS1 = new Map<number,Segundo[]>();
var hashBajadasS1 = new Map<number,Segundo[]>();
var hashSubidasS2 = new Map<number,Segundo[]>();
var hashLlanosS2 = new Map<number,Segundo[]>();
var hashBajadasS2 = new Map<number,Segundo[]>();

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


function getRandom(min:number,max:number):number{
    return (Math.floor(Math.random()*(max-min)+min)/100);
}

//Funcion que inicializa los hash para que tengan 4 keys 0,25,0,50,0,75 y 1 en los 3 distintos hash
function iniciarHash(){
    var porcentaje = 0.25;
    for(let i=0;i<4;i++){
        hashSubidasS1.set(porcentaje,[]);
        hashLlanosS1.set(porcentaje,[]);
        hashBajadasS1.set(porcentaje,[]);
        hashSubidasS2.set(porcentaje,[]);
        hashLlanosS2.set(porcentaje,[]);
        hashBajadasS2.set(porcentaje,[]);
        porcentaje+=0.25;
    }
}

//Funcion que limpia los hash 
function limpiarHash(){
    hashBajadasS1.clear();
    hashLlanosS1.clear();
    hashSubidasS1.clear();
    hashBajadasS2.clear();
    hashLlanosS2.clear();
    hashSubidasS2.clear();
}
//Funcion que recibe un arreglo de arreglos y hace interseccion de todos sus elementos
function interseccionMultiple(array:any):any{
    var interseccion:Segundo[] = [];
    for(let i=0;i<array.length;i++){
        interseccion = intersection(interseccion,array[i]);
    }
    return interseccion;
}

//Recibe dos arreglos y retorna un arreglo que contiene el conjunto interseccion de ambos
function intersection (array1: Segundo[], array2: Segundo[]): Segundo[] {
    if(array1.length>0&&array2.length>0){
        let result: Segundo[] = [];
        for (let i = 0; i < array1.length; i++) {
            for (let j = 0; j < array2.length; j++) {
                if (array1[i].getSegundos() === array2[j].getSegundos() && result.indexOf(array1[i]) === -1) {
                    result.push(array1[i]);
                    break;
                }
            }
        }
        return result;
    }
    else{
        if(array1.length>array2.length)
            return array1;
        else
            return array2;
    }
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

//Guarda el objeto que recibe como parametro en la lista correspondiente segun su porcentaje
function guardarEnHash(porcentaje:number,segundito:Segundo,hash:Map<any,any>){
    var arregloBajadas:Segundo[] = hash.get(porcentaje);
    arregloBajadas.push(segundito);
    hash.set(porcentaje,arregloBajadas);
}

//Funcion que recive un objeto como parametro, luego busca el procentaje de subidas, bajadas y llanos y llama una funcion para que guarde
// los datos en los hash como corresponda
function estructurarInformacion(segundito:Segundo,hashBajadas:Map<any,any>,hashSubidas:Map<any,any>,hashLlanos:Map<any,any>){
    var formasTotales = segundito.getBajadas()+segundito.getLlanos()+segundito.getSubida();
    var porcentajeBajadas = redondear(segundito.getBajadas()/formasTotales);
    guardarEnHash(porcentajeBajadas,segundito,hashBajadas);
    var porcentajeLlanos = redondear(segundito.getLlanos()/formasTotales);
    guardarEnHash(porcentajeLlanos,segundito,hashLlanos);
    var porcentajeSubidas = redondear(segundito.getSubida()/formasTotales);
    guardarEnHash(porcentajeSubidas,segundito,hashSubidas);
}

//DARLE VUELTA A LOS IF*************
function sucesiones(cancionCD:number[],cancionCI:number[],hash1:Map<any,any>,hash2:Map<any,any>,hash3:Map<any,any>){
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
            var segundito = new Segundo(segundo,Math.round(tasaDeVariacionPorSegundo),subida,bajada,llano);
            estructurarInformacion(segundito,hash1,hash2,hash3);
            //console.log("Segundo: ",segundo," subidas: ",subida," llanos: ",llano," bajada: ",bajada," tasa de variacion total: ",tasaDeVariacionPorSegundo);
            subida = llano = bajada = tasaDeVariacionPorSegundo = 0;
        }
        else{
            tasaDeVariacionPorSample = valor1-valor2;
            if(tasaDeVariacionPorSample>0.01)
                subida++;
            else if(tasaDeVariacionPorSample<-0.01)
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

function comparar(n1:Segundo,n2:Segundo){
    return n1.getSegundos()-n2.getSegundos();
}

//Funcion que obtiene la lista de un hash segun su key
function obtenerLista(hash:Map<any,any>,key:number):Segundo[]{
    return hash.get(key);
}


function matchSegundos():Segundo[]{
    var listasDelistas:Segundo[][] = [];
    var interseccion:Segundo[] = [];
    for(let i=0;i<10;i++){
        var listaDeMatchS1:Segundo[][] = [];
        var listaDeMatchS2:Segundo[][] = [];
        var random = redondear(getRandom(0,100));
        var random2 = redondear(getRandom(0,100));
        var random3 = redondear(getRandom(0,100));
        listaDeMatchS1.push(obtenerLista(hashSubidasS1,random)); 
        listaDeMatchS1.push(obtenerLista(hashLlanosS1,random2)); 
        listaDeMatchS1.push(obtenerLista(hashBajadasS1,random3));
        listaDeMatchS2.push(obtenerLista(hashSubidasS2,random));
        listaDeMatchS2.push(obtenerLista(hashLlanosS2,random2));
        listaDeMatchS2.push(obtenerLista(hashBajadasS2,random3));
        listaDeMatchS1 = interseccionMultiple(listaDeMatchS1);
        listaDeMatchS2 = interseccionMultiple(listaDeMatchS2);
         

        console.log("****iNICIO******");
        console.log(listaDeMatchS1); //[1,2,....y] de s1
        console.log("****S2******"); //[1,2] de s2 
        console.log(listaDeMatchS2);
        console.log("****FIN******");
        //listasDelistas.push(interseccion);
    }
    return interseccion;
}



function generarCancion(listaEncoder:Segundo[]){
    listaEncoder.sort(comparar);
    var tempCD:number[]=[];
    var tempCI:number[]=[];
    for(let pos in listaEncoder){
        var inicio=(listaEncoder[pos].getSegundos()-1)*44100;
        var final=(listaEncoder[pos].getSegundos())*44100
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
            sucesiones(rigthS1,leftS1,hashBajadasS1,hashSubidasS1,hashLlanosS1);
            sucesiones(rigthS2,leftS2,hashBajadasS2,hashSubidasS2,hashLlanosS2);
            var segundosMatch:Segundo[] = matchSegundos();
            generarCancion(segundosMatch);
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
