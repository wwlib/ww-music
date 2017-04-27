/// <reference types="node" />
import { EventEmitter } from "events";
export declare class MidiToMediaPlayer extends EventEmitter {
    rootPath: string;
    midiPlayer: any;
    callback: any;
    fileLoaded: boolean;
    scheduleIntervalId: any;
    scheduleTimeSlice: number;
    scheduleStartTime: number;
    previousScheduleTime: number;
    externalTimeSource: any;
    robotInfo: any;
    constructor(rootPath: string);
    setExternalTimeSource(source: any): void;
    setMarkersToLyrics(value: boolean): void;
    isAnimationControl(noteNumber: number): boolean;
    loadMidiFile(filename: string): void;
    playMidiFile(startTime: number, cb: any): void;
    getCurrentScheduleTick(): any;
    ticksToMilliseconds(ticks: number): number;
    millisecondsToTicks(milliseconds: number): number;
    stop(): void;
    scheduleAllNoteEvents(startTime: number, robotInfo?: any, cb?: any): void;
    scheduleEvents(acStartTime: number): number;
    onSocketMidiCommand(command: any): void;
    click(): void;
    dataToMelody(data: any, timeInterval?: number): void;
    dispose(): void;
}
