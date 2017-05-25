"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const findRoot = require('find-root');
const events_1 = require("events");
const InstrumentManager_1 = require("./InstrumentManager");
const MidiPlayer = require('midi-player-js');
const Soundfont = require('soundfont-player');
class MidiToMediaPlayer extends events_1.EventEmitter {
    constructor(rootPath) {
        super();
        this.rootPath = rootPath;
        this.fileLoaded = false;
        this.externalTimeSource = null;
        // this.playSpecifiedChannel = false;
        // this.specifiedChannel = undefined;
        // Initialize player and register event handler
        this.midiPlayer = new MidiPlayer.Player((event) => {
            //console.log(`Event: ${event.name} ${event.noteName} ${event.noteNumber} ${event.channel}`);
            let noteNumber = event.noteNumber;
            let midiChannel = event.channel;
            let velocity = event.velocity;
            if (event.name === 'Note on') {
                if (!this.isAnimationControl(noteNumber)) {
                    // if ((this.specifiedChannel == 0) || !this.playSpecifiedChannel || (this.playSpecifiedChannel && (event.channel == this.specifiedChannel)) || event.channel == 11) {
                    //     InstrumentManager.instance.playMidiNoteWithChannel(noteNumber, velocity, midiChannel);
                    // }
                    this.emit('note', event);
                }
            }
            else if (event.name === 'Note off') {
                // InstrumentManager.instance.stopMidiNoteWithChannel(noteNumber, velocity, midiChannel);
            }
            else if (event.name === 'Lyric') {
                this.emit('lyric', event);
            }
            else if (event.name === 'Text Event') {
                this.emit('text', event);
            }
        });
        if (this.midiPlayer) {
            this.midiPlayer.on('endOfFile', () => {
                // this.playSpecifiedChannel = false;
                // this.specifiedChannel = undefined;
                //this.removeAllListeners();
                if (this.callback) {
                    this.callback();
                    this.callback = null;
                }
            });
        }
    }
    setExternalTimeSource(source) {
        this.externalTimeSource = source;
        if (this.midiPlayer) {
            this.midiPlayer.setExternalTimeSource(source);
        }
    }
    setMarkersToLyrics(value) {
        if (this.midiPlayer) {
            this.midiPlayer.setMarkersToLyrics(true);
        }
    }
    isAnimationControl(noteNumber) {
        //console.log(`MidiToMediaPlayer: isAnimationControl: ${noteNumber}`)
        let result = false;
        if (noteNumber < 24) {
            result = true;
            this.emit('animation', noteNumber);
        }
        return result;
    }
    loadMidiFile(filename) {
        this.fileLoaded = false;
        let filePath = path.join(this.rootPath, 'midi', filename);
        this.midiPlayer.loadFile(filePath);
        this.fileLoaded = true;
    }
    // playMidiFileChannel(startTime: number, channel: number, cb: any): void {
    //     console.log(`MidiToMediaPlayer: playMidiFileChannel: ${channel}`);
    //     // this.playSpecifiedChannel = true;
    //     // this.specifiedChannel = channel;
    //     this.playMidiFile(startTime, cb);
    // }
    playMidiFile(startTime, cb) {
        // Load a MIDI file
        this.callback = cb;
        if (this.fileLoaded) {
            this.midiPlayer.setStartTime(startTime);
            this.midiPlayer.play();
        }
        else {
            console.log(`MidiToMediaPlayer: playMidiFile: no file loaded`);
            if (cb) {
                cb();
            }
        }
    }
    getCurrentScheduleTick() {
        let currentTime = this.externalTimeSource ? this.externalTimeSource() : performance.now(); //new Date().getTime();
        return Math.round((currentTime - this.scheduleStartTime) / 1000 * (this.midiPlayer.division * (this.midiPlayer.tempo / 60))) + this.midiPlayer.startTick;
    }
    ticksToMilliseconds(ticks) {
        return Math.floor((ticks / this.midiPlayer.division / this.midiPlayer.tempo * 60) * 1000);
    }
    millisecondsToTicks(milliseconds) {
        return (milliseconds / 1000) * (this.midiPlayer.division * (this.midiPlayer.tempo / 60));
    }
    stop() {
        clearInterval(this.scheduleIntervalId);
        this.scheduleIntervalId = null;
        this.midiPlayer.stop();
        InstrumentManager_1.InstrumentManager.instance.stopAllNotes();
        console.log(`MidiToMediaPlayer: stop:`, this.midiPlayer.events);
    }
    scheduleAllNoteEvents(startTime, robotInfo, cb) {
        //console.log(`MidiToMediaPlayer: scheduleAllNoteEvents:`);
        this.robotInfo = robotInfo;
        let currentTime = this.externalTimeSource ? this.externalTimeSource() : performance.now(); //new Date().getTime();
        let startTimeOffset = startTime - currentTime;
        let acCurrentTime = InstrumentManager_1.InstrumentManager.instance.audioContext.currentTime; //seconds
        let acStartTime = acCurrentTime + (startTimeOffset / 1000);
        console.log(`MidiToMediaPlayer: audioContext.currentTime: ${InstrumentManager_1.InstrumentManager.instance.audioContext.currentTime}`);
        console.log(`MidiToMediaPlayer: current time: ${currentTime}`);
        console.log(`MidiToMediaPlayer: target start time: ${startTime}`);
        console.log(`MidiToMediaPlayer: time offset (to target): ${startTimeOffset}`);
        console.log(`MidiToMediaPlayer: audioContext start time: ${acStartTime}`);
        console.log(`MidiToMediaPlayer: Tempo: ${this.midiPlayer.tempo}`);
        this.scheduleStartTime = currentTime;
        this.previousScheduleTime = 0;
        this.scheduleTimeSlice = 500; //miliseconds
        this.scheduleEvents(acStartTime);
        this.scheduleIntervalId = setInterval(() => {
            let scheduledTicks = this.scheduleEvents(acStartTime);
            //let previousTicks: number = this.millisecondsToTicks(this.previousScheduleTime);
            //console.log(`  this.midiPlayer.totalTicks: ${this.midiPlayer.totalTicks}, previousTicks: ${scheduledTicks}`);
            if (scheduledTicks >= this.midiPlayer.totalTicks) {
                console.log(`    done scheduling`);
                clearInterval(this.scheduleIntervalId);
                this.scheduleIntervalId = null;
                if (cb) {
                    cb();
                }
            }
        }, this.scheduleTimeSlice);
    }
    scheduleEvents(acStartTime) {
        let previousTicks = this.millisecondsToTicks(this.previousScheduleTime);
        let nextTicks = this.millisecondsToTicks(this.previousScheduleTime + this.scheduleTimeSlice * 2);
        // console.log(`MidiToMediaPlayer: acStartTime: ${acStartTime}, previousTicks: ${previousTicks}`);
        this.midiPlayer.events.forEach((trackEvents) => {
            let eventsToSchedule = [];
            let nextEvent = trackEvents[0];
            while (nextEvent && (nextEvent.tick < nextTicks)) {
                eventsToSchedule.push(trackEvents.shift());
                nextEvent = trackEvents[0];
            }
            let channelsToPlay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            if (this.robotInfo) {
                channelsToPlay = [];
                let robotNumber = this.robotInfo.number;
                let robotCount = this.robotInfo.robotCount;
                for (let i = 1; i <= 16; i++) {
                    if ((((i % robotCount) + 1) == robotNumber) || (robotNumber == 0)) {
                        channelsToPlay.push(i);
                    }
                }
            }
            InstrumentManager_1.InstrumentManager.instance.scheduleAllNoteEvents(acStartTime, eventsToSchedule, this.midiPlayer.division, this.midiPlayer.tempo, channelsToPlay);
        });
        this.previousScheduleTime += this.scheduleTimeSlice;
        return nextTicks;
    }
    onSocketMidiCommand(command) {
        //console.log(`MidiToMediaPlayer: onSocketMidiMessage: `, command);
        switch (command.data.type) {
            case 'noteon':
                if (!this.isAnimationControl(command.data.noteNumber)) {
                    InstrumentManager_1.InstrumentManager.instance.playMidiNoteWithChannel(command.data.noteNumber, command.data.velocity, command.data.channel);
                }
                break;
            case 'noteoff':
                InstrumentManager_1.InstrumentManager.instance.stopMidiNoteWithChannel(command.data.noteNumber, command.data.velocity, command.data.channel);
                break;
            case 'controlchange':
                InstrumentManager_1.InstrumentManager.instance.controlChangeWithChannel(command.data.channel, command.data);
                break;
        }
    }
    click() {
        InstrumentManager_1.InstrumentManager.instance.playMidiNoteWithChannel(60, 127, 11);
    }
    dataToMelody(data, timeInterval) {
        console.log(`MidiToMediaPlayer: dataToMelody: `, data);
        if (typeof data == 'string') {
            let tones = [];
            for (var i = 0; i < data.length; ++i) {
                let charCode = data.charCodeAt(i);
                tones.push((charCode - 25) % 23); // subtracting 25 aligns A with middle C (60)
            }
            InstrumentManager_1.InstrumentManager.instance.playTonesWithInstrument(tones, 'audio_dtm', timeInterval);
        }
    }
    dispose() {
        // TODO
    }
}
exports.MidiToMediaPlayer = MidiToMediaPlayer;
//# sourceMappingURL=MidiToMediaPlayer.js.map