import { Instrument } from './Instrument';
import { AudioInstrument } from './AudioInstrument';
import { SoundfontInstrument } from './SoundfontInstrument';
import { AbstractInstrumentManager } from './AbstractInstrumentManager';

const Soundfont = require('soundfont-player');

export class InstrumentManager extends AbstractInstrumentManager {

    public rootPath: string;
    public instrumentConfig: any[];
    public instruments: Map<string, Instrument>;
    public audioContext: AudioContext;
    public masterVolumeGainNode: GainNode;

    public channelMap: Map<number, Instrument>;

    private static _instance: InstrumentManager;

    public toneToMidiMap: Map<number, number>;

    constructor() {
        super()
        this.instruments = new Map<string, Instrument>();
        this.channelMap = new  Map<number, Instrument>();
        this.audioContext = new AudioContext();
        this.masterVolumeGainNode = this.audioContext.createGain();
        this.masterVolumeGainNode.gain.value = 1.0;
        this.masterVolumeGainNode.connect(this.audioContext.destination);
        this.setupToneToMidiMap();
    }

    static get instance(): InstrumentManager {
        if (!this._instance) {
            this._instance = new InstrumentManager();
        }
        return this._instance
    }

    init(rootPath: string, instrumentConfig: any[]): void {
        console.log(`InstrumentManager: init: ${rootPath}: `, instrumentConfig);
        this.rootPath = rootPath;
        this.instrumentConfig = instrumentConfig;
        this.instrumentConfig.forEach((instrumentData: any) => {
            if (instrumentData.enabled) {
                let instrument: Instrument;
                if (instrumentData.instrumentClass == 'AudioInstrument') {
                    instrument = new AudioInstrument(this.audioContext, this.masterVolumeGainNode, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                } else if (instrumentData.instrumentClass == 'SoundfontInstrument') {
                    instrument = new SoundfontInstrument(this.audioContext, this.masterVolumeGainNode, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                }
                if (instrumentData.midiChannel) {
                    this.channelMap.set(instrumentData.midiChannel, instrument);
                }
            }
        });

        this.setupChannelMap();
    }

    setupChannelMap(): void {
        let defaultChannelMap: any[] = [
            {channel: 1, intrumentId: 'audio_piano'},
            {channel: 2, intrumentId: 'audio_organ'},
            {channel: 3, intrumentId: 'audio_lead'},
            {channel: 4, intrumentId: 'audio_strings'},
            {channel: 5, intrumentId: 'audio_guitar'},
            {channel: 6, intrumentId: 'audio_pizzicato'},
            {channel: 7, intrumentId: 'audio_sax'},
            {channel: 8, intrumentId: 'audio_horn'},
            {channel: 9, intrumentId: 'audio_bass'},
            {channel: 10, intrumentId: 'audio_gmkit'},
            {channel: 11, intrumentId: 'audio_blocks'},
            {channel: 12, intrumentId: 'audio_flute'},
            {channel: 13, intrumentId: 'audio_marimba'},
            {channel: 14, intrumentId: 'audio_oohs'},
            {channel: 15, intrumentId: 'audio_dtm'},
        ];

        // Set midi channel instruments for channels that are note yet assigned by the instrumentConfig
        defaultChannelMap.forEach(instrumentData => {
            if (!this.channelMap.get(instrumentData.channel)) {
                this.channelMap.set(instrumentData.channel, this.instruments.get(instrumentData.intrumentId));
            }
        });
    }

    playMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void {
        let instrument: Instrument = this.channelMap.get(channel);
        if (instrument) {
            instrument.playMidiNote(noteNumber, velocity);
        } else {
            console.log(`InstrumentManager: playMidiNoteWithChannel: error: no instrument for channel ${channel}`);
        }
    }

    stopMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void {
        let instrument: Instrument = this.channelMap.get(channel);
        if (instrument) {
            instrument.stopMidiNote(noteNumber, velocity);
        } else {
            console.log(`InstrumentManager: playMidiNoteWithChannel: error: no instrument for channel ${channel}`);
        }
    }

    stopAllNotes(): void {
        this.channelMap.forEach((instrument: Instrument, channel: number) => {
            if (instrument) {
                instrument.stopAllNotes();
            }
        });
    }

    setMasterVolume(volume: number): void {
        if ( (volume >= 0) && (volume <= 1.0) ) {
            this.masterVolumeGainNode.gain.value = volume;
        }
    }

    controlChangeWithChannel(channel: number, data: any): void {
        console.log(`InstrumentManager: controlChangeWithChannel: channel: ${channel}, data: ${data.controllerNumber} ${data.value}`);
    }

    setupToneToMidiMap(): void {
        this.toneToMidiMap = new Map<number, number>();

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

    playTonesWithInstrument(tones: number[], instrumentName: string, timeInterval?: number): void {
        console.log(`InstrumentManager: playTonesWithInstrument: ${instrumentName} ${timeInterval}`, tones);
        timeInterval = timeInterval || 0.1;
        let instrument: Instrument = this.instruments.get(instrumentName);
        let time: number = 0;
        tones.forEach((tone: number) => {
            let midiNote: number = 60 + this.toneToMidiMap.get(tone);
            console.log(`  midiNote: ${midiNote}, timeInterval: ${timeInterval}`);
            instrument.playMidiNote(midiNote, 127, time);
            time += timeInterval;
        });
    }

    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number, channels?: number[]): void {
        // inspect the events to see which channel this track is using
        let trackChannel: number = 1;
        events.some((event: any) => {
            if (event.channel) {
                trackChannel = event.channel;
                return true;
            }
        });

        // schedule this track's events if they are for any channel spcified in the channels list
        if (!channels || (channels.some(x => x == trackChannel)) ) {
            let instrument = this.channelMap.get(trackChannel);
            if (instrument) {
                instrument.scheduleAllNoteEvents(startTime, events, division, tempo);
            }
        } else {
            // console.log('skipping: not scheduling notes for channel:', trackChannel);
        }
    }
}
