import {Segundo} from './Segundo';
import {myMap} from './myMapa';
import {myHash} from './hashing';
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
var estructuraHash:myHash = new myHash();

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
    return Math.floor(Math.random()*(max-min+1)+min);
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


//DARLE VUELTA A LOS IF*************
function sucesiones(cancionCD:number[],cancionCI:number[]):Segundo[]{
    var punto:number=11;var valor1:number=0;var valor2:number=0;
    var tamanno:number=cancionCD.length-1;var sucesion:Segundo[]=[];

    var segundo:number = 0;
    var samples:number = 0;var tasaDeVariacionPorSample:number = 0;
    var tasaDeVariacionPorSegundo:number = 0;
    var subida:number = 0;var bajada:number = 0;var llano:number = 0;

    valor1=Math.abs(cancionCD[0])*Math.abs(cancionCI[0]);
    valor2=Math.abs(cancionCD[punto])*Math.abs(cancionCI[punto]);
    while(punto<=tamanno){
        if(samples==4000){
            samples = 0;
            segundo +=1;
            /*var segundito = new Segundo(segundo,Math.round(tasaDeVariacionPorSegundo),subida,bajada,llano);
            estructurarInformacion(segundito,hash1,hash2,hash3);*/
            sucesion.push(new Segundo(segundo,Math.round(tasaDeVariacionPorSegundo),subida,bajada,llano));
            console.log("Segundo: ",segundo," subidas: ",subida," llanos: ",llano," bajada: ",bajada," tasa de variacion total: ",tasaDeVariacionPorSegundo);
            subida = llano = bajada = tasaDeVariacionPorSegundo = 0;
        }
        else{
            tasaDeVariacionPorSample = valor1-valor2;
            if(tasaDeVariacionPorSample>0.01)
                subida++;
            else if(tasaDeVariacionPorSample<-0.01) 
                bajada++
            else
                llano++;
            tasaDeVariacionPorSegundo += Math.abs(tasaDeVariacionPorSample);
            valor1=valor2;
            punto+=11;
            valor2=Math.abs(cancionCD[punto])*Math.abs(cancionCI[punto]);
            samples++;
        }
    }
    return sucesion;
}


function comparar(n1:number,n2:number){
    return n1-n2;
}

function matchSegundos():number[]{
    var listaSucecionesS1=sucesiones(rigthS1,leftS1);
    var listaSucecionesS2=sucesiones(rigthS2,leftS2);
    estructuraHash.reEstructurarS1(listaSucecionesS1);//toma la sista de segundos de s1 y los asigna al hash correspondiente

    var listaEncoder:number[]=[];
    var sg=0;
    for(var segundoS2 of listaSucecionesS2){
        for(let i=0;i<15;i++){
            var listaDeMatchS1:Segundo[][] = [];
            var listaInterseccion:Segundo[]=[];
            listaDeMatchS1=estructuraHash.getListaMatchS1();
            listaInterseccion = interseccionMultiple(listaDeMatchS1);

            for(var segundoInter of listaInterseccion){
                var contTemp:number=0;
                if(segundoS2.getTasa()>segundoInter.getTasa()-70 && segundoS2.getTasa()<segundoInter.getTasa()+70){
                    if(Math.abs(segundoS2.getSubida()-segundoInter.getSubida())<=100){contTemp++;}
                    if(Math.abs(segundoS2.getBajadas()-segundoInter.getBajadas())<=100){contTemp++;}
                    if(Math.abs(segundoS2.getLlanos()-segundoInter.getLlanos())<=100){contTemp++;}
                    if(contTemp>=3){
                        if(listaEncoder.indexOf(segundoInter.getSegundos())==-1)listaEncoder.push(segundoInter.getSegundos());
                    }    
                }
            }
        }
        sg++;
    }
    //console.log(listaDeS);
    //console.log(listaEncoder);
    return listaEncoder
}

function generarMatch(listaEncoder:number[]){
    listaEncoder.sort(comparar);
    var tempDerecha:number[]=[];
    var tempIzquierda:number[]=[];
    for(let pos in listaEncoder){
        var inicio=(listaEncoder[pos]-1)*44100;
        var final=(listaEncoder[pos])*44100
        for(inicio;inicio<=final;inicio++){
            tempDerecha.push(rigthS1[inicio]);
            tempIzquierda.push(leftS1[inicio]);
        }
    }
    
    var der=new Float32Array(tempDerecha);
    var izq=new Float32Array(tempIzquierda);

    var wavEn=WavEncoder.encode.sync({sampleRate:44100,channelData:[der,izq]});
    fs.writeFileSync("prueba.wav",new Buffer(wavEn));
}

function mtFunction(){
    estructuraHash.iniciarHash();
    generarMatch(matchSegundos());
}
/*-----------------------------------------UnMatch------------------------------------------------------------*/

//Crea la nueva cancion, esta ves quitanto aquellas partes que hagan match con el S2
function generarUnMatch(listaEncoder:number[]){
    listaEncoder.sort(comparar);
    console.log(listaEncoder);
    var tempDerecha:number[]=[];
    var tempIzquierda:number[]=[];
    var pos=1;
    console.log(rigthS1.length,"\n");
    while(pos*44100<=rigthS1.length){
        if(listaEncoder.indexOf(pos)==-1){
            console.log(pos);
            var inicio=(pos-1)*44100;
            var final=(pos)*44100
            for(inicio;inicio<=final;inicio++){
                tempDerecha.push(rigthS1[inicio]);
                tempIzquierda.push(leftS1[inicio]);
            }
        }
        pos++;
    }
    
    var der=new Float32Array(tempDerecha);
    var izq=new Float32Array(tempIzquierda);

    var wavEn=WavEncoder.encode.sync({sampleRate:44100,channelData:[der,izq]});
    fs.writeFileSync("prueba.wav",new Buffer(wavEn));
}

function umtFunction(){
    estructuraHash.iniciarHash();
    generarUnMatch(matchSegundos());
}

/*------------------------------------------DJ---------------------------------------------------------*/

function guardarCancion(cancion:number[][]){
        
    var der=new Float32Array(cancion[0]);
    var izq=new Float32Array(cancion[1]);

    var wavEn=WavEncoder.encode.sync({sampleRate:44100,channelData:[der,izq]});
    fs.writeFileSync("prueba.wav",new Buffer(wavEn));
}

//pruba de dj, agarra segundos cualquiera de s1 y crea lista de segundos(listas de audio[0][1]) por eso son [][][]
function generarMix(cancion:number[]){
    var tonadas:number[][][]=[];
    cancion.sort(comparar);
    for(var elemento of cancion){
        var inicio=(cancion[elemento]-1)*44100;
        var final=(cancion[elemento])*44100;
        var segundoCreado:number[][]=[[],[]];
        for(inicio;inicio<=final;inicio++){
            segundoCreado[0].push(rigthS1[inicio]);
            segundoCreado[1].push(leftS1[inicio]);
        }
        tonadas.push(segundoCreado);
    }

    var mapaDJ:myMap=new myMap(tonadas);
    mapaDJ.cargarEstructura();
    mapaDJ.asignarTonadas();

    guardarCancion(mapaDJ.getCreacion());
}

function compTamannos(a:number[],b:number[]){
    return b.length-a.length;
}

function matchDj():number[]{
    var listaSucecionesS1=sucesiones(rigthS1,leftS1);
    estructuraHash.reEstructurarS1(listaSucecionesS1);

    var listaDeS:number[][]=[];

    var cantidad=Math.floor(listaSucecionesS1.length*0.75);
    for(var sg=0;sg<cantidad;sg++){
        var randTemp=Math.floor(Math.random()*listaSucecionesS1.length);
        var pivote=listaSucecionesS1[randTemp];listaSucecionesS1.splice(randTemp,1);
        listaDeS.push([]);
        for(let i=0;i<15;i++){
            var listaInterseccion:Segundo[]=[];
            listaInterseccion = interseccionMultiple(estructuraHash.getListaMatchS1());
            for(var segundoInter of listaInterseccion){
                var contTemp:number=0;
                if(pivote.getTasa()>segundoInter.getTasa()-70 && pivote.getTasa()<segundoInter.getTasa()+70){
                    if(Math.abs(pivote.getSubida()-segundoInter.getSubida())<=100){contTemp++;}
                    if(Math.abs(pivote.getBajadas()-segundoInter.getBajadas())<=100){contTemp++;}
                    if(Math.abs(pivote.getLlanos()-segundoInter.getLlanos())<=100){contTemp++;}
                    if(contTemp>=2){
                        if(listaDeS[sg].indexOf(segundoInter.getSegundos())==-1)listaDeS[sg].push(segundoInter.getSegundos());
                    }    
                }
            }
        }
    }

    var listaEncoder:number[]=[];
    listaDeS.sort(compTamannos);//ordena la lista de mayor cantidad de segundos a la lista de menor segundos
    var pos=0;
    while(pos<listaDeS.length && listaEncoder.length<10){//para obtener el ranking de las tonadas(segundos) mas parecidos
        for(var pos2=0;pos2<listaDeS[pos].length;pos2++){//para tomar solo un segundo de cada subtista
            if(listaEncoder.indexOf(listaDeS[pos][pos2])==-1){//evitar segundos repetidos
                listaEncoder.push(listaDeS[pos][pos2]);
            }
        }
        pos++;
    }
    //console.log(listaEncoder);
    return listaEncoder;
}

function djFunction(){
    estructuraHash.iniciarHash();
    generarMix(matchDj());
}

function funcionSeleccionada(){
    switch(parametros[0]){
        case "mt":
            console.log("Funcion mt");
            console.log("------------------------");
            mtFunction();
            console.log("------------------------");
            break;
        case "umt":
            console.log("Funcion umt");
            umtFunction();
            break;
        case "dj":
            console.log("Funcion dj");
            djFunction();
            //pruebaDJ(); 
            break;
        case "cmp":
            console.log("Funcion cmp");
            break;
        default:
            console.log("Nada");
    }
}
//node dist/main.js umt s1.wav s2.wav