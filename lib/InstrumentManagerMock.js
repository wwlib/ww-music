"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractInstrumentManager_1 = require("./AbstractInstrumentManager");
class InstrumentManagerMock extends AbstractInstrumentManager_1.AbstractInstrumentManager {
    constructor() {
        super();
        console.log(`InstrumentManagerMock: constructor:`);
        this.audioContext = new AbstractInstrumentManager_1.AudioContextMock();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new InstrumentManagerMock();
        }
        return this._instance;
    }
    init(rootPath, instrumentConfig) {
    }
    setupChannelMap() {
    }
    playMidiNoteWithChannel(noteNumber, velocity, channel) {
    }
    stopMidiNoteWithChannel(noteNumber, velocity, channel) {
    }
    stopAllNotes() {
    }
    setMasterVolume(volume) {
    }
    controlChangeWithChannel(channel, data) {
    }
    setupToneToMidiMap() {
    }
    playTonesWithInstrument(tones, instrumentName, timeInterval) {
    }
    scheduleAllNoteEvents(startTime, events, division, tempo, channels) {
    }
}
exports.InstrumentManagerMock = InstrumentManagerMock;
//# sourceMappingURL=InstrumentManagerMock.js.map