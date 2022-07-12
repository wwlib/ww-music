export declare class AudioContextMock {
    readonly currentTime: number;
}
export declare abstract class AbstractInstrumentManager {
    audioContext: AudioContext | AudioContextMock;
    abstract init(rootPath: string, instrumentConfig: any[]): void;
    abstract setupChannelMap(): void;
    abstract playMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void;
    abstract stopMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void;
    abstract stopAllNotes(): void;
    abstract setMasterVolume(volume: number): void;
    abstract controlChangeWithChannel(channel: number, data: any): void;
    abstract setupToneToMidiMap(): void;
    abstract playTonesWithInstrument(tones: number[], instrumentName: string, timeInterval?: number): void;
    abstract scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number, channels?: number[]): void;
}
