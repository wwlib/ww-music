import { Instrument } from './Instrument';
export declare class SoundfontInstrument extends Instrument {
    soundfont: any;
    constructor(audioContext: AudioContext, masterVolumeGainNode: GainNode, rootPath: string, data: any);
    initWithData(data: any): void;
    playMidiNote(noteNumber: number, velocity: number, startTime?: number): void;
    stopMidiNote(noteNumber: number, velocity: number): void;
    stopAllNotes(): void;
    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void;
}
