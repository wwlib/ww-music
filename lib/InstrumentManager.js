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
        this.masterVolumeGainNode = this.audioContext.createGain();
        this.masterVolumeGainNode.gain.value = 1.0;
        this.masterVolumeGainNode.connect(this.audioContext.destination);
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
                let instrument;
                if (instrumentData.instrumentClass == 'AudioInstrument') {
                    instrument = new AudioInstrument_1.AudioInstrument(this.audioContext, this.masterVolumeGainNode, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                }
                else if (instrumentData.instrumentClass == 'SoundfontInstrument') {
                    instrument = new SoundfontInstrument_1.SoundfontInstrument(this.audioContext, this.masterVolumeGainNode, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                }
                if (instrumentData.midiChannel) {
                    this.channelMap.set(instrumentData.midiChannel, instrument);
                }
            }
        });
        this.setupChannelMap();
    }
    setupChannelMap() {
        let defaultChannelMap = [
            { channel: 1, intrumentId: 'audio_piano' },
            { channel: 2, intrumentId: 'audio_organ' },
            { channel: 3, intrumentId: 'audio_lead' },
            { channel: 4, intrumentId: 'audio_strings' },
            { channel: 5, intrumentId: 'audio_guitar' },
            { channel: 6, intrumentId: 'audio_pizzicato' },
            { channel: 7, intrumentId: 'audio_sax' },
            { channel: 8, intrumentId: 'audio_horn' },
            { channel: 9, intrumentId: 'audio_bass' },
            { channel: 10, intrumentId: 'audio_gmkit' },
            { channel: 11, intrumentId: 'audio_blocks' },
            { channel: 12, intrumentId: 'audio_flute' },
            { channel: 13, intrumentId: 'audio_marimba' },
            { channel: 14, intrumentId: 'audio_oohs' },
            { channel: 15, intrumentId: 'audio_dtm' },
        ];
        // Set midi channel instruments for channels that are note yet assigned by the instrumentConfig
        defaultChannelMap.forEach(instrumentData => {
            if (!this.channelMap.get(instrumentData.channel)) {
                this.channelMap.set(instrumentData.channel, this.instruments.get(instrumentData.intrumentId));
            }
        });
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
    setMasterVolume(volume) {
        if ((volume >= 0) && (volume <= 1.0)) {
            this.masterVolumeGainNode.gain.value = volume;
        }
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