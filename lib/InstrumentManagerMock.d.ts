import { AbstractInstrumentManager, AudioContextMock } from "./AbstractInstrumentManager";
export declare class InstrumentManagerMock extends AbstractInstrumentManager {
    private static _instance;
    audioContext: AudioContextMock;
    constructor();
    static readonly instance: InstrumentManagerMock;
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
