import fs = require('fs');
import path = require('path');

import { Instrument } from './Instrument';
import { AudioNote, AudioNoteTime } from './AudioNote';

//{ "name":"pulse",  "index":"0", "id":"pulse", "tempo":"98", "divisions":"1", "file_offset":"0", "instrumentClass":"PulseInstrument", "soundFileName":"Pulse.wav",
//	"notes": [

export class AudioInstrument extends Instrument {

    public index: number;
    public tempo: number;
    public divisions: number;
    public fileOffset: number;
    public instrumentClass: string;
    public soundFilename: string;

    public notes: Map<number, AudioNote>;
    public lowestNoteNumber: number;
    public highestNoteNumber: number;

    public decodedBuffer: any;
    public ready: boolean;

    constructor(audioContext: AudioContext, rootPath: string, data: any) {
        super(audioContext, rootPath, data);

        let filePath: string = path.join(rootPath, 'audio/instruments', this.soundFilename);
        let fsBuffer = fs.readFileSync(filePath);
        let audioData = new Uint8Array(fsBuffer).buffer;

        this.ready = false;
        this.audioContext.decodeAudioData(audioData, (buffer) => {
            this.decodedBuffer = buffer;
            this.ready = true;
        });
    }

    initWithData(data: any): void {
        this.enabled = data.enabled;
        this.name = data.name;
        this.index = +data.index;
        this.id = data.id;
        this.tempo = data.tempo;
        this.divisions = data.divisions;
        this.fileOffset = data.fileOffset;
        if (typeof this.fileOffset != 'number') {
            this.fileOffset = 0;
        }
        this.instrumentClass = data.instrumentClass;
        this.soundFilename = data.soundFilename;

        this.notes = new Map<number, AudioNote>();
        this.lowestNoteNumber = 127;
        this.highestNoteNumber = 0;
        let currentOffsetInDivisions: number = 0;
        if (data.notes) {
            data.notes.forEach((noteData: any) => {
                let note: AudioNote = new AudioNote(noteData, this.tempo, this.divisions, currentOffsetInDivisions, this.fileOffset);
                currentOffsetInDivisions += note.durationInDivisions;
                this.notes.set(note.noteNumber, note);
                this.lowestNoteNumber = Math.min(this.lowestNoteNumber, note.noteNumber);
                this.highestNoteNumber = Math.max(this.highestNoteNumber, note.noteNumber);
            });
        }
    }

    limitMidiNote(noteNumber: number): number {
        let result: number = noteNumber;

        if (noteNumber < this.lowestNoteNumber) {
            let octave: number = Math.floor((this.lowestNoteNumber - noteNumber) /12);
            result = noteNumber + (12 * (octave + 1));
        }

        if (noteNumber > this.highestNoteNumber) {
            let octave: number = Math.floor((noteNumber - this.highestNoteNumber) /12);
            result = noteNumber - (12 * (octave + 1));
        }
        return result;
    }

    playMidiNote(noteNumber: number, velocity: number, startTime?: number): void {
        if (typeof velocity != 'number') {
            velocity = 127;
        }
        if (typeof startTime != 'number') {
            startTime = this.audioContext.currentTime;
        } else {
            startTime += this.audioContext.currentTime;
        }
        let note: AudioNote = this.notes.get(noteNumber);//(this.limitMidiNote(noteNumber));
        if (this.ready) {
            if (note) {
                note.bufferSource = this.audioContext.createBufferSource();
                note.bufferSource.buffer = this.decodedBuffer;

                note.gainNode = this.audioContext.createGain();
                note.gainNode.gain.value = velocity / 127; //1.0;

                note.bufferSource.connect(note.gainNode);
                //note.gainNode.gain.exponentialRampToValueAtTime(1.0, this.audioContext.currentTime + 0.1);
                note.gainNode.connect(this.audioContext.destination);

                note.bufferSource.start(startTime, note.startTime, note.durationTime);
                this.playingNoteMap.set(noteNumber, note);
            } else {
                // console.log(`Note ${noteNumber} not defined for instrument: ${this.name}`);
            }
        } else {
            console.log(`AudioInstrument: Instrument: ${this.name} not ready`);
        }
    }

    stopMidiNote(noteNumber: number, velocity: number): void {
        let note: any = this.playingNoteMap.get(noteNumber);
        if (note) {
            //var gainNode = this.audioContext.createGain();
            //gainNode.gain.value = 1.0;
            note.gainNode.gain.cancelScheduledValues( this.audioContext.currentTime );
            //note.gainNode.gain.setValueAtTime(note.gainNode.gain.value, this.audioContext.currentTime);
            //note.connect(gainNode);
            note.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
            //gainNode.connect(this.audioContext.destination);
            note.bufferSource.stop(this.audioContext.currentTime + 0.25);
            this.playingNoteMap.set(noteNumber, null);
        }
    }

    stopAllNotes(): void {
        this.playingNoteMap.forEach((note: AudioNote, noteNumber: number) => {
            this.stopMidiNote(noteNumber, 127);
        });
    }

    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void {
        //console.log(`AudioInstrument: scheduleAllNoteEvents:`, events);
        events.forEach((event) => {
            if (event.name == 'Note on') {
                let note: AudioNote = this.notes.get(event.noteNumber);
                if (note) {
                    let noteStartTime: number = (event.tick / division / tempo * 60) + startTime; //this.audioContext.currentTime;
                    // console.log(`  ${this.name}: scheduleing note ${event.noteNumber} with velocity ${event.velocity} at ${noteStartTime}`);
                    note.bufferSource = this.audioContext.createBufferSource();
                    note.bufferSource.buffer = this.decodedBuffer;
                    note.gainNode = this.audioContext.createGain();
                    note.gainNode.gain.value = event.velocity / 127; //1.0;
                    note.bufferSource.connect(note.gainNode);
                    note.gainNode.connect(this.audioContext.destination);
                    note.bufferSource.start(noteStartTime, note.startTime, note.durationTime);
                    this.playingNoteMap.set(event.noteNumber, note);
                } else {
                    //console.log(`  ${this.name}: note not found for: ${event.noteNumber}`);
                }
            } else if (event.name == 'Note off') {
                let note: any = this.playingNoteMap.get(event.noteNumber);
                if (note) {
                    let noteStopTime: number = (event.tick / division / tempo * 60) + startTime; //this.audioContext.currentTime;
                    note.gainNode.gain.setValueAtTime(note.gainNode.gain.value, noteStopTime);
                    note.gainNode.gain.exponentialRampToValueAtTime(0.01, noteStopTime + 0.25);
                    note.bufferSource.stop(noteStopTime + 0.25);
                    this.playingNoteMap.set(event.noteNumber, null);
                }
            }
        });
    }
}
