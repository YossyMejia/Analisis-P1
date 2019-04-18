/**
 * Filename: wav-test.ts
 * Author: rnunez
 * Date: 04/10/2019
 * Description: testing wav encoder
 */

import * as fs from 'fs';
// import { complex as fft } from 'fft';
import * as WavEncoder from 'wav-encoder';
// import { default as ft } from 'fourier-transform';
import * as WavDecoder from 'wav-decoder';

/*process.argv.forEach((val,index)=>{
  console.log(`${index}:${val}`)
})*/
var my:number[][]=[[],[]];

function mostrar(m:number[][]){
  for(var ii=0;ii<10;ii++){
    console.log(m[0][ii]);
    console.log(m[1][ii]);
  }
}

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

readFile("C:\\Users\\ticas\\Desktop\\TEC\\l Semestre - 2019\\Analisis de Algoritmos\\Proyectos\\EUPHORIA.wav").then((buffer) => {
  return WavDecoder.decode(buffer);
}).then(function(audioData) {
  console.log("ampliando 30%");
  const size = 20000;

  for(var i=0; i<audioData.channelData[0].length; i++) {
    my[0].push(audioData.channelData[0][i]);
    my[1].push(audioData.channelData[1][i]);
  }

  // for(var i=0; i<audioData.channelData[0].length; i++) {
  //   audioData.channelData[1][i]+=audioData.channelData[0][i];
  //   audioData.channelData[0][i]*=20;
  //   audioData.channelData[0][i]+=0.000000259254;
  // }

  for(var i=44100*5; i<44100*10; i++) {
    audioData.channelData[0][i-44100*5] = audioData.channelData[0][i];
  }

  for(var i=44100*11; i<44100*16; i++) {
    audioData.channelData[0][i+44100*6] = audioData.channelData[0][i];
  }


  /*console.log("writing...");
  WavEncoder.encode(audioData).then((buffer: any) => {
    fs.writeFileSync("C:\\Users\\ticas\\Desktop\\TEC\\l Semestre - 2019\\Analisis de Algoritmos\\Proyectos\\newsulky.wav", new Buffer(buffer));
  });*/

  mostrar(my);
});