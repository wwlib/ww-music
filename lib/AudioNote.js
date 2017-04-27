// { "midi":"60", "name":"Block 1", "offset":"0", "duration":"1" }
"use strict";
class AudioNote {
    constructor(data, tempo, divisions, offsetInDivisions, fileOffset) {
        this.initWithData(data);
        this.offsetInDivisions = offsetInDivisions;
        let divisionTime = 60 / tempo / divisions;
        this._startTime = divisionTime * this.offsetInDivisions + fileOffset;
        this._durationTime = divisionTime * this.durationInDivisions - .05; //this.fileOffset;
    }
    initWithData(data) {
        this.noteNumber = +data.midi;
        this.name = data.name;
        //this.offsetInDivisions = +data.offset;
        this.durationInDivisions = +data.duration;
    }
    get startTime() {
        return this._startTime;
    }
    get durationTime() {
        return this._durationTime;
    }
    get audioNoteTime() {
        return {
            startTime: this._startTime,
            durationTime: this._durationTime
        };
    }
}
exports.AudioNote = AudioNote;
//# sourceMappingURL=AudioNote.js.map