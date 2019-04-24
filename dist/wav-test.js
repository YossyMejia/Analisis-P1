"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filename: wav-test.ts
 * Author: rnunez
 * Date: 04/10/2019
 * Description: testing wav encoder
 */
//npm install "@types/node" --save-dev
const fs = require("fs");
// import { default as ft } from 'fourier-transform';
//npm i wav-decoder
const WavDecoder = require("wav-decoder");
var left = []; //lista con los puntos del canal izq de la cancion
var right = []; //lista con los puntos del canal der de la cancion
var rights2 = []; //lista con los puntos del canal der del sample
var lefts2 = []; //lista con los puntos del canal izq del sample
var hashVariaciones = new Map(); //se almacenan las variaciones (key) de la cancion y el dato al que dirijen las key es una lista de seg donde esta presente esa variacion
var listaDeS = [];
var listaFinal = [];
var variacionesSample = []; //se almacenan las variaciones por segundo del sample 2
const readFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, buffer) => {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
};
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//Reduce el arreglo de puntos elijiendo los puntos cada 11 puntos, crea un arreglo temporal donde los va almacenando luego lo retorna
function reducirArreglo(arreglo) {
    var arregloNuevo = [];
    var tamanno = arreglo.length;
    for (let i = 0; i < tamanno; i += 11) {
        arregloNuevo.push(arreglo[i]);
    }
    return arregloNuevo;
}
function guardarInformacion(estructura, tasaDeVariacionPorSegundo, segundo) {
    if (Array.isArray(estructura) == true) {
        variacionesSample.push(tasaDeVariacionPorSegundo);
    }
    else {
        if (estructura.has(tasaDeVariacionPorSegundo) == true) {
            var lista = estructura.get(tasaDeVariacionPorSegundo);
            lista.push(segundo);
            estructura.delete(tasaDeVariacionPorSegundo);
            estructura.set(tasaDeVariacionPorSegundo, lista);
        }
        else {
            var listaTmp = [];
            listaTmp.push(segundo);
            hashVariaciones.set(tasaDeVariacionPorSegundo, listaTmp);
        }
    }
}
//Toma el arreglo y va haciendo operaciones con los puntos, segundo es una variable para identificar en que segundo se encuentra de la cancion
//, milisegundo es una variable para saber que cuando se llega a 1000 se debe reiniciar y pasar al siguiente segundo
//, samples es para saber que cada 4 samples se aumentan los milisegundos, subida, bajada y llano son variables para identificar un poco el comportamiento 
//del patron de un sample al otro. 
function analizarArreglo(arreglo, estructura) {
    var segundo = 0;
    var milisegundos = 0;
    var samples = 0;
    var tasaDeVariacionPorSample = 0;
    var tasaDeVariacionPorSegundo = 0;
    var subida = 0;
    var bajada = 0;
    var llano = 0;
    for (let i = 0; i < arreglo.length; i++) {
        if (milisegundos == 1000) {
            segundo += 1;
            milisegundos = 0;
            tasaDeVariacionPorSegundo = Math.round(tasaDeVariacionPorSegundo / 10) * 10;
            guardarInformacion(estructura, tasaDeVariacionPorSegundo, segundo);
            console.log("Segundo: ", segundo, " subidas: ", subida, " llanos: ", llano, " bajada: ", bajada, " tasa de variacion total: ", tasaDeVariacionPorSegundo);
            subida = 0;
            llano = 0;
            bajada = 0;
            tasaDeVariacionPorSegundo = 0;
        }
        if (samples == 4) {
            milisegundos++;
            samples = 0;
        }
        tasaDeVariacionPorSample = (1 - arreglo[i]) - (1 - arreglo[i + 1]);
        if (Math.abs(tasaDeVariacionPorSample) >= 0.1000000000000) {
            if (tasaDeVariacionPorSample > 0)
                subida++;
            else if (tasaDeVariacionPorSample < 0)
                bajada++;
        }
        else if (tasaDeVariacionPorSample == 0 || Math.abs(tasaDeVariacionPorSample) < 0.01000000000000) {
            llano++;
        }
        tasaDeVariacionPorSegundo += Math.abs(Math.round(tasaDeVariacionPorSample));
        samples++;
    }
}
//Rec
function obtenerSegundoPorTasa() {
    for (let tasa in variacionesSample) {
        listaDeS.push([]);
        for (let i = 20; i >= 0; i--) {
            var variacionDisminuida = Math.abs(variacionesSample[tasa] - i);
            var variacionAumentada = Math.abs(variacionesSample[tasa] + i);
            if (hashVariaciones.has(variacionAumentada) == true) {
                var listaTmp = hashVariaciones.get(variacionAumentada);
                for (let seg in listaTmp) {
                    if (listaDeS[tasa].indexOf(listaTmp[seg]) < 0)
                        listaDeS[tasa].push(listaTmp[seg]);
                }
            }
            if (hashVariaciones.has(variacionDisminuida) == true) {
                var listaTmp = hashVariaciones.get(variacionDisminuida);
                for (let seg in listaTmp) {
                    if (listaDeS[tasa].indexOf(listaTmp[seg]) < 0)
                        listaDeS[tasa].push(listaTmp[seg]);
                }
            }
        }
        listaDeS[tasa] = listaDeS[tasa].sort();
    }
    console.log(variacionesSample);
    console.log(listaDeS);
}
/*function obtenerSegundosConsecutivos(){
  for(let i=0;i<listaDeS.length;i++){
    for(let seg in listaDeS[i]){
      listaFinal.push([]);
      var segundo:number = listaDeS[i][seg] as number;
      for(let ii=i+1;i<listaDeS.length;ii++){
        if(listaDeS[i].indexOf(segundo+1)>0)
          listaFinal[seg].push(listaDeS[ii][]);
      }
    }
  }
}*/
//Lectura de cancion y almacenandola en dos listas donde cada lista es el canal izq o derecho
readFile("b.wav").then((buffer) => {
    return WavDecoder.decode(buffer);
}).then(function (audioData) {
    var tamanno = audioData.channelData[0].length;
    for (var i = 0; i < tamanno; i++) {
        left.push(audioData.channelData[1][i]);
        right.push(audioData.channelData[0][i]);
    }
    //Lecutra de el sonido de pocos segundos y almacenandola en dos listas donde cada lista es el canal izq o derecho
    readFile("sb-35.wav").then((buffer) => {
        return WavDecoder.decode(buffer);
    }).then(function (audioData) {
        var tamanno = audioData.channelData[0].length;
        for (var i = 0; i < tamanno; i++) {
            lefts2.push(audioData.channelData[1][i]);
            rights2.push(audioData.channelData[0][i]);
        }
        left = reducirArreglo(left);
        right = reducirArreglo(right);
        lefts2 = reducirArreglo(lefts2);
        rights2 = reducirArreglo(rights2);
        console.log("Sample 1 R");
        analizarArreglo(right, hashVariaciones);
        console.log("Sample 2 R");
        analizarArreglo(rights2, variacionesSample);
        //obtenerSegundoPorTasa();
    });
});
//# sourceMappingURL=wav-test.js.map