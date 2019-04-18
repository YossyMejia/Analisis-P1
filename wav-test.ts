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

console.log("hola");
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

readFile("C:\\Users\\Jossy Mejia\\Documents\\5 semestre\\Analisis+\\P1\\Hunger.wav").then((buffer) => {
  return WavDecoder.decode(buffer);
}).then(function(audioData) {
  console.log("ampliando 30%");
  const size = 20000;

  for(var i=0; i<25; i++) {
    console.log(audioData.channelData[0][i]);
    console.log(audioData.channelData[1][i]);
    console.log('*******************');
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


  console.log("writing...");
  WavEncoder.encode(audioData).then((buffer: any) => {
    fs.writeFileSync("C:\\Users\\Jossy Mejia\\Documents\\5 semestre\\Analisis+\\P1\\newsulky.wav", new buffer(buffer));
  });

});