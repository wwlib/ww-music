import fs = require('fs');
import path = require('path');
import { Instrument } from './Instrument';

const Soundfont = require('soundfont-player');

export class SoundfontInstrument extends Instrument {

    public soundfont: any;

    constructor(audioContext: AudioContext, rootPath: string, data: any) {
        super(audioContext, rootPath, data);

        let filePath: string = path.join(rootPath, 'audio/MusyngKite', data.soundFilename);

        Soundfont.instrument(this.audioContext, filePath).then((instrument: any) => {
            if (instrument) {
                this.soundfont = instrument;
                console.log(`SoundfontInstrument: loaded: ${filePath}`);
            } else {
                console.log(`SoundfontInstrument: error instantiating: ${data.instrumentFile}`, data);
            }
        });
    }

    initWithData(data: any): void {
        this.enabled = data.enabled;
        this.name = data.name;
        this.id = data.id;
    }

    playMidiNote(noteNumber: number, velocity: number, startTime?: number): void {
        if (this.soundfont) {
            //this.soundfont.play(noteNumber).stop(this.audioContext.currentTime + 0.25);
            this.playingNoteMap.set(noteNumber, this.soundfont.play(noteNumber));
        }
    }

    stopMidiNote(noteNumber: number, velocity: number): void {
        if (this.soundfont) {
            //this.soundfont.play(noteNumber).stop(this.audioContext.currentTime + 0.25);
            let note: any = this.playingNoteMap.get(noteNumber);
            if (note) {
                note.stop(this.audioContext.currentTime);
                this.playingNoteMap.set(noteNumber, null);
            }
        }
    }

    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void {

    }
}
