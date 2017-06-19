import { Instrument } from './Instrument';
import { AudioNote } from './AudioNote';
export declare class AudioInstrument extends Instrument {
    index: number;
    tempo: number;
    divisions: number;
    fileOffset: number;
    instrumentClass: string;
    soundFilename: string;
    notes: Map<number, AudioNote>;
    lowestNoteNumber: number;
    highestNoteNumber: number;
    decodedBuffer: any;
    ready: boolean;
    constructor(audioContext: AudioContext, masterVolumeGainNode: GainNode, rootPath: string, data: any);
    initWithData(data: any): void;
    limitMidiNote(noteNumber: number): number;
    playMidiNote(noteNumber: number, velocity: number, startTime?: number): void;
    stopMidiNote(noteNumber: number, velocity: number): void;
    stopAllNotes(): void;
    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void;
}
