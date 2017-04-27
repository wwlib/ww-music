export interface AudioNoteTime {
    startTime: number;
    durationTime: number;
}
export declare class AudioNote {
    sampleTempo: number;
    sampleDivisions: number;
    noteNumber: number;
    name: string;
    offsetInDivisions: number;
    durationInDivisions: number;
    bufferSource: any;
    gainNode: any;
    _startTime: number;
    _durationTime: number;
    constructor(data: any, tempo: number, divisions: number, offsetInDivisions: number, fileOffset: number);
    initWithData(data: any): void;
    readonly startTime: number;
    readonly durationTime: number;
    readonly audioNoteTime: AudioNoteTime;
}
