import { AbstractInstrumentManager, AudioContextMock} from "./AbstractInstrumentManager";


export class InstrumentManagerMock extends AbstractInstrumentManager {

    
    private static _instance: InstrumentManagerMock;

    public audioContext: AudioContextMock;

    constructor() {
        super()
        console.log(`InstrumentManagerMock: constructor:`);
        this.audioContext = new AudioContextMock();
    }

    static get instance(): InstrumentManagerMock {
        if (!this._instance) {
            this._instance = new InstrumentManagerMock();
        }
        return this._instance
    }

    init(rootPath: string, instrumentConfig: any[]): void {
    }

    setupChannelMap(): void {
    }

    playMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void {
    }

    stopMidiNoteWithChannel(noteNumber: number, velocity: number, channel: number): void {
    }

    stopAllNotes(): void {
    }

    setMasterVolume(volume: number): void {
    }

    controlChangeWithChannel(channel: number, data: any): void {
    }

    setupToneToMidiMap(): void {
    }

    playTonesWithInstrument(tones: number[], instrumentName: string, timeInterval?: number): void {
    }

    scheduleAllNoteEvents(startTime: number, events: any[], division: number, tempo: number, channels?: number[]): void {
    }
}
