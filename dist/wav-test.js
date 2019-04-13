"use strict";
/**
 * Filename: wav-test.ts
 * Author: rnunez
 * Date: 04/10/2019
 * Description: testing wav encoder
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
// import { complex as fft } from 'fft';
var WavEncoder = __importStar(require("wav-encoder"));
// import { default as ft } from 'fourier-transform';
var WavDecoder = __importStar(require("wav-decoder"));
var readFile = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filepath, function (err, buffer) {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
};
readFile("C:\\Users\\ticas\\Desktop\\TEC\\l Semestre - 2019\\Analisis de Algoritmos\\Proyectos\\EUPHORIA.wav").then(function (buffer) {
    return WavDecoder.decode(buffer);
}).then(function (audioData) {
    console.log("ampliando 30%");
    var size = 20000;
    for (var i = 0; i < 10; i++) {
        console.log(audioData.channelData[0][i]);
        console.log(audioData.channelData[1][i]);
        console.log('*******************');
    }
    // for(var i=0; i<audioData.channelData[0].length; i++) {
    //   audioData.channelData[1][i]+=audioData.channelData[0][i];
    //   audioData.channelData[0][i]*=20;
    //   audioData.channelData[0][i]+=0.000000259254;
    // }
    for (var i = 44100 * 5; i < 44100 * 10; i++) {
        audioData.channelData[0][i - 44100 * 5] = audioData.channelData[0][i];
    }
    for (var i = 44100 * 11; i < 44100 * 16; i++) {
        audioData.channelData[0][i + 44100 * 6] = audioData.channelData[0][i];
    }
    console.log("writing...");
    WavEncoder.encode(audioData).then(function (buffer) {
        fs.writeFileSync("C:\\Users\\ticas\\Desktop\\TEC\\l Semestre - 2019\\Analisis de Algoritmos\\Proyectos\\newsulky.wav", new Buffer(buffer));
    });
});
//# sourceMappingURL=wav-test.js.map