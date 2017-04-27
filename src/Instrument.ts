export abstract class Instrument {

    public enabled: boolean;
    public name: string;
    public id: string;
    public audioContext: AudioContext;
    public rootPath: string;
    public playingNoteMap: Map<number, any>;

    constructor(audioContext: AudioContext, rootPath: string, data: any) {
        this.audioContext = audioContext;
        this.rootPath = rootPath;
        this.playingNoteMap = new Map<number, any>();

        this.initWithData(data);
    }

    abstract initWithData(data: any): void;

    abstract playMidiNote(noteNumber: number, velocity: number, startTime?: number): void;

    abstract stopMidiNote(noteNumber: number, velocity: number): void;

    abstract scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number): void;

}
