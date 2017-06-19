"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Instrument {
    constructor(audioContext, masterVolumeGainNode, rootPath, data) {
        this.audioContext = audioContext;
        this.masterVolumeGainNode = masterVolumeGainNode;
        this.rootPath = rootPath;
        this.playingNoteMap = new Map();
        this.initWithData(data);
    }
}
exports.Instrument = Instrument;
//# sourceMappingURL=Instrument.js.map