/**
 * Filename: wav-test.ts
 * Author: rnunez
 * Date: 04/10/2019
 * Description: testing wav encoder
 */
      //npm install "@types/node" --save-dev
      import * as fs from 'fs';
      // import { complex as fft } from 'fft';
            //npm i wav-encoder en terminal 
      import * as WavEncoder from 'wav-encoder';
      // import { default as ft } from 'fourier-transform';
           //npm i wav-decoder
      import * as WavDecoder from 'wav-decoder';
      
      var left:number[] = []; //lista con los puntos del canal izq de la cancion
      var right:number[] = []; //lista con los puntos del canal der de la cancion
      var rights2:number[] = []; //lista con los puntos del canal der del sample
      
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
      
      readFile("franela2_20.wav").then((buffer) => {
        return WavDecoder.decode(buffer);
      }).then(function(audioData) {
        var tamanno = audioData.channelData[0].length;
        for(var i=0; i<tamanno; i++) {
          left.push(audioData.channelData[1][i]);
          right.push(audioData.channelData[0][i]);
        }
      
      //Reduce el arreglo de puntos elijiendo los puntos cada 11 puntos, crea un arreglo temporal donde los va almacenando luego lo retorna
      function reducirArreglo(arreglo:number[]):number[]{
        var arregloNuevo:number[] = [];
        var tamanno = arreglo.length;
        for(let i=0; i<tamanno;i+=11){
          arregloNuevo.push(arreglo[i]);
        }
        return arregloNuevo;
      }
      
       //Toma el arreglo y va haciendo operaciones con los puntos, segundo es una variable para identificar en que segundo se encuentra de la cancion
       //, milisegundo es una variable para saber que cuando se llega a 1000 se debe reiniciar y pasar al siguiente segundo
       //, samples es para saber que cada 4 samples se aumentan los milisegundos, subida, bajada y llano son variables para identificar un poco el comportamiento 
       //del patron de un sample al otro. 
      function analizarArreglo(arreglo:number[]){
        var segundo:number = 0;
        var milisegundos:number = 0;
        var samples:number = 0;
        var tasaDeVariacionPorSample:number = 0;
        var tasaDeVariacionPorSegundo:number = 0;
        var subida:number = 0;
        var bajada:number = 0;
        var llano:number = 0;
        for(let i=0;i<arreglo.length;i++){
          if(milisegundos==1000){
            segundo+=1;
            milisegundos = 0;
            console.log("Segundo: ",segundo," subidas: ",subida," llanos: ",llano," bajada: ",bajada," tasa de variacion total: ",tasaDeVariacionPorSegundo);
            subida = 0;
            llano = 0;
            bajada = 0;
            tasaDeVariacionPorSegundo = 0;
          }
          else if(samples==4){
            milisegundos++;
            samples = 0;
          }
          else{
            tasaDeVariacionPorSample = (1-arreglo[i]) - (1-arreglo[i+1]);
            if(tasaDeVariacionPorSample>0)
              subida++;
            else if(tasaDeVariacionPorSample<0)
              bajada++;
            else if(tasaDeVariacionPorSample==0)
              llano++;
              tasaDeVariacionPorSegundo += Math.abs(tasaDeVariacionPorSample);
            samples++;
          }
        }
      }
      
        left = reducirArreglo(left);
        right = reducirArreglo(right);
        console.log("Sample 1");
        analizarArreglo(right);
      
        readFile("sampleFranela.wav").then((buffer) => {
          return WavDecoder.decode(buffer);
        }).then(function(audioData) {
          var tamanno = audioData.channelData[0].length;
          for(var i=0; i<tamanno; i++) {
            //lefts2.push(audioData.channelData[1][i]);
            rights2.push(audioData.channelData[0][i]);
          }
          rights2 = reducirArreglo(rights2);
          console.log("Sample 2");
          analizarArreglo(rights2);
        });
      });