"use strict";
const path = require("path");
const Instrument_1 = require("./Instrument");
const Soundfont = require('soundfont-player');
class SoundfontInstrument extends Instrument_1.Instrument {
    constructor(audioContext, rootPath, data) {
        super(audioContext, rootPath, data);
        let filePath = path.join(rootPath, 'audio/MusyngKite', data.soundFilename);
        Soundfont.instrument(this.audioContext, filePath).then((instrument) => {
            if (instrument) {
                this.soundfont = instrument;
                console.log(`SoundfontInstrument: loaded: ${filePath}`);
            }
            else {
                console.log(`SoundfontInstrument: error instantiating: ${data.instrumentFile}`, data);
            }
        });
    }
    initWithData(data) {
        this.enabled = data.enabled;
        this.name = data.name;
        this.id = data.id;
    }
    playMidiNote(noteNumber, velocity, startTime) {
        if (this.soundfont) {
            //this.soundfont.play(noteNumber).stop(this.audioContext.currentTime + 0.25);
            this.playingNoteMap.set(noteNumber, this.soundfont.play(noteNumber));
        }
    }
    stopMidiNote(noteNumber, velocity) {
        if (this.soundfont) {
            //this.soundfont.play(noteNumber).stop(this.audioContext.currentTime + 0.25);
            let note = this.playingNoteMap.get(noteNumber);
            if (note) {
                note.stop(this.audioContext.currentTime);
                this.playingNoteMap.set(noteNumber, null);
            }
        }
    }
    scheduleAllNoteEvents(startTime, events, division, tempo) {
    }
}
exports.SoundfontInstrument = SoundfontInstrument;
//# sourceMappingURL=SoundfontInstrument.js.map