"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AudioInstrument_1 = require("./AudioInstrument");
const SoundfontInstrument_1 = require("./SoundfontInstrument");
const PieAnoManager_1 = require("./PieAnoManager");
const Soundfont = require('soundfont-player');
class InstrumentManager {
    constructor() {
        console.log(`InstrumentManager: constuctor:`);
        this.instruments = new Map();
        this.channelMap = new Map();
        this.audioContext = new AudioContext();
        PieAnoManager_1.PieAnoManager.init();
        this.setupToneToMidiMap();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new InstrumentManager();
        }
        return this._instance;
    }
    init(rootPath, instrumentConfig) {
        console.log(`InstrumentManager: init: ${rootPath}: `, instrumentConfig);
        this.rootPath = rootPath;
        this.instrumentConfig = instrumentConfig;
        this.instrumentConfig.forEach((instrumentData) => {
            if (instrumentData.enabled) {
                if (instrumentData.instrumentClass == 'AudioInstrument') {
                    let instrument = new AudioInstrument_1.AudioInstrument(this.audioContext, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                }
                else if (instrumentData.instrumentClass == 'SoundfontInstrument') {
                    let instrument = new SoundfontInstrument_1.SoundfontInstrument(this.audioContext, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                }
            }
        });
        this.setupChannelMap();
    }
    setupChannelMap() {
        this.channelMap.set(1, this.instruments.get('audio_piano')); //.get("soundfont_piano"));
        this.channelMap.set(2, this.instruments.get('audio_organ')); //.get("soundfont_pizzicato"));
        this.channelMap.set(3, this.instruments.get('audio_lead')); //("soundfont_lead_sawtooth"));
        this.channelMap.set(4, this.instruments.get("audio_strings"));
        this.channelMap.set(5, this.instruments.get("audio_guitar"));
        this.channelMap.set(6, this.instruments.get("audio_pizzicato"));
        this.channelMap.set(7, this.instruments.get("audio_sax"));
        this.channelMap.set(8, this.instruments.get("audio_horn"));
        this.channelMap.set(9, this.instruments.get('audio_bass')); //("soundfont_synth_bass"));
        this.channelMap.set(10, this.instruments.get("audio_gmkit"));
        this.channelMap.set(11, this.instruments.get("audio_blocks"));
        this.channelMap.set(12, this.instruments.get("audio_flute"));
        this.channelMap.set(13, this.instruments.get("audio_marimba"));
        this.channelMap.set(14, this.instruments.get('audio_oohs')); //("soundfont_oohs"));
        // this.channelMap.set(15, this.instruments.get("soundfont_steel_drums"));
        this.channelMap.set(15, this.instruments.get("audio_dtm"));
    }
    playMidiNoteWithChannel(noteNumber, velocity, channel) {
        let instrument = this.channelMap.get(channel);
        if (instrument) {
            instrument.playMidiNote(noteNumber, velocity);
        }
        else {
            console.log(`InstrumentManager: playMidiNoteWithChannel: error: no instrument for channel ${channel}`);
        }
    }
    stopMidiNoteWithChannel(noteNumber, velocity, channel) {
        let instrument = this.channelMap.get(channel);
        if (instrument) {
            instrument.stopMidiNote(noteNumber, velocity);
        }
        else {
            console.log(`InstrumentManager: playMidiNoteWithChannel: error: no instrument for channel ${channel}`);
        }
    }
    stopAllNotes() {
        this.channelMap.forEach((instrument, channel) => {
            if (instrument) {
                instrument.stopAllNotes();
            }
        });
    }
    controlChangeWithChannel(channel, data) {
        console.log(`InstrumentManager: controlChangeWithChannel: channel: ${channel}, data: ${data.controllerNumber} ${data.value}`);
    }
    testPieAno() {
        PieAnoManager_1.PieAnoManager.test();
    }
    setupToneToMidiMap() {
        this.toneToMidiMap = new Map();
        this.toneToMidiMap.set(0, 0);
        this.toneToMidiMap.set(1, 2);
        this.toneToMidiMap.set(2, 4);
        this.toneToMidiMap.set(3, 5);
        this.toneToMidiMap.set(4, 7);
        this.toneToMidiMap.set(5, 9);
        this.toneToMidiMap.set(6, 11);
        this.toneToMidiMap.set(7, 0 + 12);
        this.toneToMidiMap.set(8, 2 + 12);
        this.toneToMidiMap.set(9, 4 + 12);
        this.toneToMidiMap.set(10, 5 + 12);
        this.toneToMidiMap.set(11, 7 + 12);
        this.toneToMidiMap.set(12, 9 + 12);
        this.toneToMidiMap.set(13, 11 + 12);
        this.toneToMidiMap.set(14, 0 + 24);
        this.toneToMidiMap.set(15, 2 + 24);
        this.toneToMidiMap.set(16, 4 + 24);
        this.toneToMidiMap.set(17, 5 + 24);
        this.toneToMidiMap.set(18, 7 + 24);
        this.toneToMidiMap.set(19, 9 + 24);
        this.toneToMidiMap.set(20, 11 + 24);
        this.toneToMidiMap.set(21, 0 + 36);
        this.toneToMidiMap.set(22, 2 + 36);
        this.toneToMidiMap.set(23, 4 + 36);
        this.toneToMidiMap.set(24, 5 + 36);
        this.toneToMidiMap.set(25, 7 + 36);
        this.toneToMidiMap.set(26, 9 + 36);
        this.toneToMidiMap.set(27, 11 + 36);
        this.toneToMidiMap.set(28, 0 + 48);
        this.toneToMidiMap.set(29, 2 + 48);
        this.toneToMidiMap.set(30, 4 + 48);
        this.toneToMidiMap.set(31, 5 + 48);
        this.toneToMidiMap.set(32, 7 + 48);
        this.toneToMidiMap.set(33, 9 + 48);
        this.toneToMidiMap.set(34, 11 + 48);
        this.toneToMidiMap.set(35, 0 + 60);
        this.toneToMidiMap.set(36, 2 + 60);
        this.toneToMidiMap.set(37, 4 + 60);
        this.toneToMidiMap.set(38, 5 + 60);
        this.toneToMidiMap.set(39, 7 + 60);
        this.toneToMidiMap.set(40, 9 + 60);
        this.toneToMidiMap.set(41, 11 + 60);
    }
    playTonesWithInstrument(tones, instrumentName, timeInterval) {
        console.log(`InstrumentManager: playTonesWithInstrument: ${instrumentName} ${timeInterval}`, tones);
        timeInterval = timeInterval || 0.1;
        let instrument = this.instruments.get(instrumentName);
        let time = 0;
        tones.forEach((tone) => {
            let midiNote = 60 + this.toneToMidiMap.get(tone);
            console.log(`  midiNote: ${midiNote}, timeInterval: ${timeInterval}`);
            instrument.playMidiNote(midiNote, 127, time);
            time += timeInterval;
        });
    }
    scheduleAllNoteEvents(startTime, events, division, tempo, channels) {
        // console.log(`InstrumentManager: scheduleAllNoteEvents:`);
        let trackChannel = 1;
        events.some((event) => {
            if (event.channel) {
                trackChannel = event.channel;
                // console.log(`  found track channel: ${trackChannel}`);
                return true;
            }
        });
        // play channels in the channels list
        if (!channels || (channels.some(x => x == trackChannel))) {
            let instrument = this.channelMap.get(trackChannel);
            if (instrument) {
                instrument.scheduleAllNoteEvents(startTime, events, division, tempo);
            }
        }
    }
}
exports.InstrumentManager = InstrumentManager;
//# sourceMappingURL=InstrumentManager.js.map