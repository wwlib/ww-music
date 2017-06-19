export declare abstract class Instrument {
    enabled: boolean;
    name: string;
    id: string;
    audioContext: AudioContext;
    masterVolumeGainNode: GainNode;
    rootPath: string;
    playingNoteMap: Map<number, any>;
    constructor(audioContext: AudioContext, masterVolumeGainNode: GainNode, rootPath: string, data: any);
    abstract initWithData(data: any): void;
    abstract playMidiNote(noteNumber: number, velocity: number, startTime?: number): void;
    abstract stopMidiNote(noteNumber: number, velocity: number): void;
    abstract stopAllNotes(): void;
    abstract scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void;
}
