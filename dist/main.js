"use strict";
/**
 * Filename: main.ts
 * Author: rnunez
 * Date: 03/21/2019
 * Description: main program file
 */
Object.defineProperty(exports, "__esModule", { value: true });
var midi_player_1 = require("./midi-player");
var SONG_DURATION = 2 * 60 * 1000; // 2 minutes song milisegundos
var minNoteDuration = 200;
var noteDuration = 1200; // 1.2 seconds note
var song = []; // [[midiNote, duration, timeline]]
var minNote = 20;
var maxNote = 120;
var NOTES_PER_SECOND = 5;
var AMOUNT_OF_NOTES = SONG_DURATION / 1000 * NOTES_PER_SECOND;
var playSong = new Promise(function (resolve, reject) {
    for (var i = 0; i < AMOUNT_OF_NOTES; i++) { // intentando que el random me lleve a 3 notas overlap en los mismos 2 segundos
        song.push([
            Math.floor(Math.random() * (maxNote - minNote) + minNote),
            Math.floor(Math.random() * (noteDuration - minNoteDuration) + minNoteDuration),
            Math.random() * SONG_DURATION
        ]); // timeline
    }
    if (song.length === AMOUNT_OF_NOTES) {
        resolve(song);
    }
    else {
        reject(song);
    }
})
    .then(function (song) {
    var player = new midi_player_1.MidiPlayer(song);
    player.buildMidiFile();
})
    .catch((function (song) {
    console.log("no se genero bien la cancion");
}));
//# sourceMappingURL=main.js.map