import { EventEmitter } from "events";
import { AbstractInstrumentManager } from './AbstractInstrumentManager';
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
    constructor(rootPath: string, instrumentManager?: AbstractInstrumentManager);
    setStartAtTime(startAtTime: number): void;
    isAnimationControl(noteNumber: number): boolean;
    loadMidiFile(filename: string): void;
    playMidiFile(startTime: number): void;
    getCurrentScheduleTick(): any;
    ticksToMilliseconds(ticks: number): number;
    millisecondsToTicks(milliseconds: number): number;
    stop(): void;
    scheduleAllNoteEvents(startTime: number, scheduleOptions?: any, cb?: any): void;
    scheduleEvents(acStartTime: number, scheduleOptions?: any): number;
    onSocketMidiCommand(command: any): void;
    click(): void;
    dataToMelody(data: any, timeInterval?: number): void;
    dispose(): void;
}
