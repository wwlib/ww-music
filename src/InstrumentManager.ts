import { Instrument } from './Instrument';
import { AudioInstrument } from './AudioInstrument';
import { SoundfontInstrument } from './SoundfontInstrument';
import { PieAnoManager } from './PieAnoManager';


const Soundfont = require('soundfont-player');

export class InstrumentManager {

    public rootPath: string;
    public instrumentConfig: any[];
    public instruments: Map<string, Instrument>;
    public audioContext: AudioContext;

    public channelMap: Map<number, Instrument>;

    private static _instance: InstrumentManager;

    public toneToMidiMap: Map<number, number>;

    constructor() {
        console.log(`InstrumentManager: constuctor:`);
        this.instruments = new Map<string, Instrument>();
        this.channelMap = new  Map<number, Instrument>();
        this.audioContext = new AudioContext();
        PieAnoManager.init();
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
                if (instrumentData.instrumentClass == 'AudioInstrument') {
                    let instrument: AudioInstrument = new AudioInstrument(this.audioContext, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                } else if (instrumentData.instrumentClass == 'SoundfontInstrument') {
                    let instrument: SoundfontInstrument = new SoundfontInstrument(this.audioContext, rootPath, instrumentData);
                    this.instruments.set(instrument.id, instrument);
                }
            }
        });

        this.setupChannelMap();
    }

    setupChannelMap(): void {
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

    controlChangeWithChannel(channel: number, data: any): void {
        console.log(`InstrumentManager: controlChangeWithChannel: channel: ${channel}, data: ${data.controllerNumber} ${data.value}`);
    }

    testPieAno(): void {
        PieAnoManager.test();
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
        // console.log(`InstrumentManager: scheduleAllNoteEvents:`);
        let trackChannel: number = 1;
        events.some((event: any) => {
            if (event.channel) {
                trackChannel = event.channel;
                // console.log(`  found track channel: ${trackChannel}`);
                return true;
            }
        });

        // play channels in the channels list
        if (!channels || (channels.some(x => x == trackChannel)) ) {
            let instrument = this.channelMap.get(trackChannel);
            if (instrument) {
                instrument.scheduleAllNoteEvents(startTime, events, division, tempo);
            }
        }
    }
}
