"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Segundo_1 = require("./Segundo");
const fs = require("fs");
// import { complex as fft } from 'fft';
const WavEncoder = require("wav-encoder");
// import { default as ft } from 'fourier-transform';
const WavDecoder = require("wav-decoder");
const parametros = process.argv.slice(2);
var rigthS1 = [];
var leftS1 = [];
var rigthS2 = [];
var leftS2 = [];
var hashSubidas = new Map();
var hashLlanos = new Map();
var hashBajadas = new Map();
function cargarCanciones(filepath, rigth, left) {
    var content = fs.readFileSync(filepath);
    var wav = WavDecoder.decode.sync(content);
    for (var i = 0; i < wav.channelData[0].length; i++) {
        rigth.push(wav.channelData[0][i]);
        left.push(wav.channelData[1][i]);
    }
}
function cargarTodo() {
    if (parametros[0] != "dj") {
        cargarCanciones(parametros[1], rigthS1, leftS1);
        cargarCanciones(parametros[2], rigthS2, leftS2);
    }
    else {
        cargarCanciones(parametros[1], rigthS1, leftS1);
    }
    funcionSeleccionada();
}
cargarTodo();
function mostrar(m) {
    var left = "";
    var rigth = "";
    for (var ii = 0; ii < 99; ii = ii + 11) {
        console.log(m[ii]);
        console.log(m[ii]);
        console.log("------------------------");
    }
}
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function iniciarHash() {
    var porcentaje = 0.25;
    var arreglo = [];
    for (let i = 0; i < 4; i++) {
        hashSubidas.set(porcentaje, arreglo);
        hashLlanos.set(porcentaje, arreglo);
        hashBajadas.set(porcentaje, arreglo);
        porcentaje += 0.25;
    }
}
function mapear(sucesiones) {
    var map = {};
    for (var indice = 0; indice < sucesiones.length; indice++) {
        if (map[sucesiones[indice].getTasa()] == null) {
            map[sucesiones[indice].getTasa()] = [indice + 1];
        }
        else {
            map[sucesiones[indice].getTasa()].push(indice + 1);
        }
    }
    return map;
}
function redondear(porcentaje) {
    var porcentajeRedondeado = (Math.round(porcentaje * 4) / 4).toFixed(2);
    if (porcentajeRedondeado < porcentaje) {
        porcentajeRedondeado += 0.25;
    }
    return porcentajeRedondeado;
}
function estructurarInformacion(segundito) {
    var formasTotales = segundito.getBajadas() + segundito.getLlanos() + segundito.getSubida();
    var porcentajeBajadas = segundito.getBajadas() / formasTotales;
    var porcentajeLlanos = segundito.getLlanos() / formasTotales;
    var porcentajeSubidas = segundito.getSubida() / formasTotales;
    porcentajeBajadas = redondear(porcentajeBajadas);
    porcentajeLlanos = redondear(porcentajeLlanos);
    porcentajeSubidas = redondear(porcentajeSubidas);
}
function sucesiones(cancionCD, cancionCI) {
    var punto = 11;
    var valor1 = 0;
    var valor2 = 0;
    var tamanno = cancionCD.length - 1;
    var segundo = 0;
    var samples = 1;
    var tasaDeVariacionPorSample = 0;
    var tasaDeVariacionPorSegundo = 0;
    var subida = 0;
    var bajada = 0;
    var llano = 0;
    valor1 = Math.abs(cancionCD[0]) * Math.abs(cancionCI[0]);
    valor2 = Math.abs(cancionCD[punto]) * Math.abs(cancionCI[punto]);
    while (punto <= tamanno) {
        if (samples % 4000 == 0) {
            samples = 1;
            segundo += 1;
            estructurarInformacion(new Segundo_1.Segundo(Math.round(tasaDeVariacionPorSegundo), subida, bajada, llano));
            //console.log("Segundo: ",segundo," subidas: ",subida," llanos: ",llano," bajada: ",bajada," tasa de variacion total: ",tasaDeVariacionPorSegundo);
            subida = llano = bajada = tasaDeVariacionPorSegundo = 0;
        }
        else {
            tasaDeVariacionPorSample = valor1 - valor2;
            if (tasaDeVariacionPorSample > 0.01000000)
                subida++;
            else if (tasaDeVariacionPorSample < -0.01000000)
                bajada++;
            else
                llano++;
            tasaDeVariacionPorSegundo += Math.abs(tasaDeVariacionPorSample);
            valor1 = valor2;
            punto += 11;
            valor2 = Math.abs(cancionCD[punto]) * Math.abs(cancionCI[punto]);
            samples++;
        }
    }
}
function comparar(n1, n2) {
    return n1 - n2;
}
function matchSegundos() {
    sucesiones(rigthS1, leftS1);
    sucesiones(rigthS2, leftS2);
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
function generarCancion(listaEncoder) {
    listaEncoder.sort(comparar);
    var tempCD = [];
    var tempCI = [];
    for (let pos in listaEncoder) {
        var inicio = (listaEncoder[pos] - 1) * 44100;
        var final = (listaEncoder[pos]) * 44100;
        for (inicio; inicio <= final; inicio++) {
            tempCD.push(rigthS1[inicio]);
            tempCI.push(leftS1[inicio]);
        }
    }
    var der = new Float32Array(tempCD);
    var izq = new Float32Array(tempCI);
    var wavEn = WavEncoder.encode.sync({ sampleRate: 44100, channelData: [izq, der] });
    fs.writeFileSync("prueba.wav", new Buffer(wavEn));
}
function funcionSeleccionada() {
    switch (parametros[0]) {
        case "mt":
            //cargar(parametros[1],my);
            console.log("Funcion mt");
            break;
        case "umt":
            var porcentaje = 0.26;
            var porcentajeRndString = (Math.round(porcentaje * 4) / 4).toFixed(2);
            var porcentajeRnd = porcentajeRndString;
            if (porcentajeRnd < porcentaje) {
                porcentajeRnd += 0, 25;
            }
            console.log(porcentajeRnd);
            console.log("Funcion umt");
            console.log("------------------------");
            iniciarHash();
            matchSegundos();
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
//# sourceMappingURL=main.js.map