import { Instrument } from './Instrument';
import { AbstractInstrumentManager } from './AbstractInstrumentManager';
export declare class InstrumentManager extends AbstractInstrumentManager {
    rootPath: string;
    instrumentConfig: any[];
    instruments: Map<string, Instrument>;
    audioContext: AudioContext;
    masterVolumeGainNode: GainNode;
    channelMap: Map<number, Instrument>;
    private static _instance;
    toneToMidiMap: Map<number, number>;
    constructor();
    static readonly instance: InstrumentManager;
    init(rootPath: string, instrumentConfig: any[]): void;
    setupChannelMap(): void;
    playMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void;
    stopMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void;
    stopAllNotes(): void;
    setMasterVolume(volume: number): void;
    controlChangeWithChannel(channel: number, data: any): void;
    setupToneToMidiMap(): void;
    playTonesWithInstrument(tones: number[], instrumentName: string, timeInterval?: number): void;
    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number, channels?: number[]): void;
}
