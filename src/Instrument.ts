export abstract class Instrument {

    public enabled: boolean;
    public name: string;
    public id: string;
    public audioContext: AudioContext;
    public masterVolumeGainNode: GainNode;
    public rootPath: string;
    public playingNoteMap: Map<number, any>;

    constructor(audioContext: AudioContext, masterVolumeGainNode: GainNode, rootPath: string, data: any) {
        this.audioContext = audioContext;
        this.masterVolumeGainNode = masterVolumeGainNode;
        this.rootPath = rootPath;
        this.playingNoteMap = new Map<number, any>();

        this.initWithData(data);
    }

    abstract initWithData(data: any): void;

    abstract playMidiNote(noteNumber: number, velocity: number, startTime?: number): void;

    abstract stopMidiNote(noteNumber: number, velocity: number): void;

    abstract stopAllNotes(): void;

    abstract scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void;

}
