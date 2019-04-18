//hola2

import * as fs from 'fs';
// import { complex as fft } from 'fft';
import * as WavEncoder from 'wav-encoder';
// import { default as ft } from 'fourier-transform';
import * as WavDecoder from 'wav-decoder';


const parametros=process.argv.slice(2);
var my:number[][]=[[],[]];
var audio:number[][]=[[],[]];
var mapLeft:{[k:number]:number[]}={};
var mapRigth:{[k:number]:number[]}={};

const readFile = (filepath: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, buffer) => {
        if (err) {
            return reject(err);
        }
        return resolve(buffer);
        });
    });
};

function cargar(path:string,cancion:number[][],llamada:boolean){
    readFile(path).then((buffer) => {
        return WavDecoder.decode(buffer);
      }).then(function(audioData) {
        //console.log("ampliando 30%");
        const size = 20000;
      
        for(var i=0; i<audioData.channelData[0].length; i++) {
          cancion[0].push(audioData.channelData[0][i]);
          cancion[1].push(audioData.channelData[1][i]);
        }
      
        if(llamada){
            funcionSeleccionada();
        }

      });
}

function    carga(){
    if(parametros[0]!="dj"){
        cargar(parametros[1],my,false);
        cargar(parametros[2],audio,true);
    }
    else{
        cargar(parametros[1],my,true);
    }
}

carga();

function mostrar(m:number[][]){
    var left:string="";
    var rigth:string="";
    for(var ii=0;ii<10;ii++){
       // left+=m[0][ii].toString()+"->";
       // rigth+=m[1][ii].toString()+"->"
      console.log(m[0][ii]);
      console.log(m[1][ii]);
      
      console.log("------------------------");
    }
    //console.log(left);
    //console.log(rigth);
}  

function getRandom(min:number,max:number){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function mtFuncition(){
    var rdm1:number;
    var rdm2:number;
    var similitud:number;
    var arrEnd:number[]=[];

    for(var k=0;k<1000;k++){
        rdm1=getRandom(0,my.length-1);
        similitud=0;
        for(var j=0; j<1000;j++){
            rdm2=getRandom(0,audio.length-1);
            if(audio[0][rdm2]==my[0][rdm1+rdm2]){
                similitud++;
            }
        }
        if(similitud!=0){ 
            arrEnd.push(similitud/1000);
        }
    }

    for(var i=0;i<10;i++){
        console.log(arrEnd[i]);
    }

}

function mapear(){
    for(var indice=0;indice<audio[0].length-1;indice++){
        if(mapLeft[audio[0][indice]]==null){
            mapLeft[audio[0][indice]]=[indice];
        }else{
            mapLeft[audio[0][indice]].push(indice);
        }
        if(mapRigth[audio[1][indice]]==null){
            mapRigth[audio[1][indice]]=[indice];
        }else{
            mapRigth[audio[1][indice]].push(indice);
        }

    }
}

function mapear2(sucesiones:number[]):{[k:number]:number[]}{
    var map:{[k:number]:number[]}={};
    for(var indice=0;indice<sucesiones.length-1;indice++){
        if(map[sucesiones[indice]]==null){
            map[sucesiones[indice]]=[indice];
        }else{
            map[sucesiones[indice]].push(indice);
        }
    }
    
    return map; 
}

function sucesiones():number[]{
    var punto:number=11;
    var valor1:number=0;
    var valor2:number=0;
    var tamanno:number=my[0].length-1;

    var sucesion:number[]=[];

    valor1=1-my[0][0];
    valor2=1-my[0][punto];
    //console.log("aqui ",punto," ",tamanno);
    while(punto<=tamanno){
        //console.log("aqui");

        sucesion.push(valor1-valor2);

        valor1=valor2
        punto=punto+11;
        valor2=1-my[0][punto];

    }
    return sucesion;
}



function funcionSeleccionada(){
    switch(parametros[0]){
        case "mt":
            //cargar(parametros[1],my);
            console.log("Funcion mt");
            break;
        case "umt":
            console.log("Funcion umt");
            console.log(my[1].length,"\n",audio[1].length);
            mostrar(my);
            console.log("------------------------");
            //console.log(mapear2(sucesiones()));
            //mostrar(audio);
            //mtFuncition();
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


/*var map:{[k:number]:number[]}={};

map[0.01]=[0.002];

map[0.01].push(12);

if(map[0.4]==null){
    map[0.4]=[1,2,3,4,5,6];
}

console.log(map[0.4]);*/