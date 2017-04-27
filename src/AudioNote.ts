
// { "midi":"60", "name":"Block 1", "offset":"0", "duration":"1" }

export interface AudioNoteTime {
    startTime: number;
    durationTime: number;
}

export class AudioNote {

    public sampleTempo: number; // bps
    public sampleDivisions: number; // divisions per beat in sample, i.e. 8th, 4th, half
    public noteNumber: number;
    public name: string;
    public offsetInDivisions: number;
    public durationInDivisions: number;

    public bufferSource: any;
    public gainNode: any;

    public _startTime: number;
    public _durationTime: number;

    constructor(data: any, tempo: number, divisions: number, offsetInDivisions: number, fileOffset: number) {
        this.initWithData(data);
        this.offsetInDivisions = offsetInDivisions;

        let divisionTime: number = 60 / tempo / divisions;
        this._startTime = divisionTime * this.offsetInDivisions + fileOffset;
        this._durationTime = divisionTime * this.durationInDivisions - .05; //this.fileOffset;
    }

    initWithData(data: any): void {
        this.noteNumber = +data.midi;
        this.name = data.name;
        //this.offsetInDivisions = +data.offset;
        this.durationInDivisions = +data.duration;
    }

    get startTime(): number {
        return this._startTime;
    }

    get durationTime(): number {
        return this._durationTime;
    }

    get audioNoteTime(): AudioNoteTime {
        return {
            startTime: this._startTime,
            durationTime: this._durationTime
        }
    }
}
