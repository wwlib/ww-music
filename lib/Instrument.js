"use strict";
class Instrument {
    constructor(audioContext, rootPath, data) {
        this.audioContext = audioContext;
        this.rootPath = rootPath;
        this.playingNoteMap = new Map();
        this.initWithData(data);
    }
}
exports.Instrument = Instrument;
//# sourceMappingURL=Instrument.js.map