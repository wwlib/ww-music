import { EventEmitter } from "events";
import { AbstractInstrumentManager } from './AbstractInstrumentManager';
export interface AudioContextClockData {
    audioContextInitTimeSeconds: number;
    audioContextInitTimeMilliseconds: number;
    localInitTimeMilliseconds: number;
    localStartTimeMilliseconds: number;
    localStartTimeOffsetMilliseconds: number;
    calculatedAcStartTimeSeconds: number;
}
export declare class AudioContextClock {
    private _audioContextInitTime;
    private _localInitTime;
    private _localStartTime;
    private _localStartTimeOffset;
    private _debug;
    constructor(audioContextTime: number, localStartTime: number, debug?: boolean);
    readonly data: AudioContextClockData;
    getAcTimeWithLocalTime(localTime: number): number;
    readonly calculatedAudioContextCurrentTime: number;
    init(audioContextTime: number): AudioContextClockData;
    updateLocalStartTime(newLocalStartTime: number): void;
    readonly calculatedAcStartTime: number;
    log(...args: any[]): void;
}
export declare class MidiToMediaPlayer extends EventEmitter {
    instrumentManager: AbstractInstrumentManager;
    rootPath: string;
    midiPlayerForScheduling: any;
    midiPlayerForEvents: any;
    fileLoaded: boolean;
    scheduleIntervalId: any;
    scheduleTimeSlice: number;
    scheduleStartTime: number;
    previousScheduleTime: number;
    private _acClock;
    private _debug;
    constructor(rootPath: string, instrumentManager?: AbstractInstrumentManager);
    debug: boolean;
    setStartAtTime(startAtTime: number): void;
    isAnimationControl(noteNumber: number): boolean;
    loadMidiFile(filename: string): void;
    playMidiFile(localStartTime: number): void;
    getCurrentScheduleTick(): any;
    ticksToMilliseconds(ticks: number): number;
    millisecondsToTicks(milliseconds: number): number;
    stop(): void;
    scheduleAllNoteEvents(localStartTime: number, scheduleOptions?: any, cb?: any): void;
    scheduleEvents(acStartTime: number, scheduleOptions?: any): number;
    onSocketMidiCommand(command: any): void;
    click(): void;
    dataToMelody(data: any, timeInterval?: number): void;
    log(...args: any[]): void;
    dispose(): void;
}
