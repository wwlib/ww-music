"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const events_1 = require("events");
const InstrumentManager_1 = require("./InstrumentManager");
/* MidiToMediaPlayer

MidiToMediaPlayer uses instances of MidiPlayerJS to load, parse and play midi files

midiPlayerForScheduling - is used to get midi event information and schedule it
with the ww InstrumentManager

midiPlayerForEvents - is used to generate real time midi events in sync with the
InstrumentManager audio playback

The 2 players run in parallel.
*/
const MidiPlayer = require('midi-player-js');
class MidiToMediaPlayer extends events_1.EventEmitter {
    constructor(rootPath, instrumentManager) {
        super();
        this.instrumentManager = instrumentManager || InstrumentManager_1.InstrumentManager.instance;
        this.rootPath = rootPath;
        this.fileLoaded = false;
        // Initialize the midiPlayerForScheduling player
        this.midiPlayerForScheduling = new MidiPlayer.Player();
        // Initialize the midiPlayerForEvents player and register an event handler function
        // Events are then emitted from MidiToMediaPlayer
        this.midiPlayerForEvents = new MidiPlayer.Player((event) => {
            // console.log(`WwMusic: MidiToMediaPlayer: midiPlayerForEvents:Event: ${event.name} ${event.noteName} ${event.noteNumber} ${event.channel}`);
            let noteNumber = event.noteNumber;
            let midiChannel = event.channel;
            let velocity = event.velocity;
            if (event.name === 'Note on') {
                if (this.isAnimationControl(noteNumber)) {
                    this.emit('animation', noteNumber);
                }
                else {
                    // console.log('WwMusic: MidiToMediPlayer: emit note', event);
                    this.emit('note', event);
                }
            }
            else if (event.name === 'Note off') {
                this.emit('note', event);
            }
            else if (event.name === 'Marker') {
                this.emit('marker', event);
            }
            else if (event.name === 'Lyric') {
                this.emit('lyric', event);
            }
            else if (event.name === 'Text Event') {
                this.emit('text', event);
            }
        });
        this.midiPlayerForEvents.on('endOfFile', () => {
            this.emit('endOfFile');
        });
    }
    isAnimationControl(noteNumber) {
        let result = false;
        if (noteNumber < 24) {
            result = true;
        }
        return result;
    }
    loadMidiFile(filename) {
        this.fileLoaded = false;
        let filePath = path.join(this.rootPath, 'midi', filename);
        this.midiPlayerForScheduling.loadFile(filePath);
        this.midiPlayerForEvents.loadFile(filePath);
        this.fileLoaded = true;
    }
    playMidiFile(startTime, cb) {
        this.callback = cb;
        if (this.fileLoaded) {
            this.midiPlayerForEvents.setStartTime(startTime);
            this.midiPlayerForEvents.play();
        }
        else {
            console.log(`WwMusic: MidiToMediaPlayer: playMidiFile: no file loaded`);
            if (cb) {
                cb();
            }
        }
    }
    getCurrentScheduleTick() {
        let currentTime = new Date().getTime();
        return Math.round((currentTime - this.scheduleStartTime) / 1000 * (this.midiPlayerForScheduling.division * (this.midiPlayerForScheduling.tempo / 60))) + this.midiPlayerForScheduling.startTick;
    }
    ticksToMilliseconds(ticks) {
        return Math.floor((ticks / this.midiPlayerForScheduling.division / this.midiPlayerForScheduling.tempo * 60) * 1000);
    }
    millisecondsToTicks(milliseconds) {
        return (milliseconds / 1000) * (this.midiPlayerForScheduling.division * (this.midiPlayerForScheduling.tempo / 60));
    }
    stop() {
        clearInterval(this.scheduleIntervalId);
        this.scheduleIntervalId = null;
        this.midiPlayerForEvents.stop();
        this.instrumentManager.stopAllNotes();
        console.log(`WwMusic: MidiToMediaPlayer: stop:`, this.midiPlayerForEvents.events);
    }
    scheduleAllNoteEvents(startTime, scheduleOptions, cb) {
        let currentTime = new Date().getTime();
        let startTimeOffset = startTime - currentTime;
        let acCurrentTime = this.instrumentManager.audioContext.currentTime; //seconds
        let acStartTime = acCurrentTime + (startTimeOffset / 1000);
        console.log(`WwMusic: MidiToMediaPlayer: audioContext.currentTime: ${this.instrumentManager.audioContext.currentTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: current time: ${currentTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: target start time: ${startTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: time offset (to target): ${startTimeOffset}`);
        console.log(`WwMusic: MidiToMediaPlayer: audioContext start time: ${acStartTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: Tempo: ${this.midiPlayerForScheduling.tempo}`);
        console.log(`WwMusic: MidiToMediaPlayer: scheduleOptions:`, scheduleOptions);
        this.scheduleStartTime = currentTime;
        this.previousScheduleTime = 0;
        this.scheduleTimeSlice = 500; //miliseconds
        this.scheduleEvents(acStartTime, scheduleOptions);
        this.scheduleIntervalId = setInterval(() => {
            let scheduledTicks = this.scheduleEvents(acStartTime, scheduleOptions);
            this.emit('scheduling', { scheduledTicks, totalTicks: this.midiPlayerForScheduling.totalTicks });
            if (scheduledTicks >= this.midiPlayerForScheduling.totalTicks) {
                console.log(`WwMusic: MidiToMediaPlayer: done scheduling`);
                clearInterval(this.scheduleIntervalId);
                this.scheduleIntervalId = null;
                if (cb) {
                    cb();
                }
            }
        }, this.scheduleTimeSlice);
    }
    scheduleEvents(acStartTime, scheduleOptions) {
        let nextTicks = this.millisecondsToTicks(this.previousScheduleTime + this.scheduleTimeSlice * 2);
        this.midiPlayerForScheduling.events.forEach((trackEvents) => {
            let eventsToSchedule = [];
            let nextEvent = trackEvents[0];
            while (nextEvent && (nextEvent.tick < nextTicks)) {
                eventsToSchedule.push(trackEvents.shift());
                nextEvent = trackEvents[0];
            }
            let channelsToPlay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
            if (scheduleOptions && scheduleOptions.channelsToPlay) {
                channelsToPlay = scheduleOptions.channelsToPlay;
            }
            this.instrumentManager.scheduleAllNoteEvents(acStartTime, eventsToSchedule, this.midiPlayerForScheduling.division, this.midiPlayerForScheduling.tempo, channelsToPlay);
        });
        this.previousScheduleTime += this.scheduleTimeSlice;
        return nextTicks;
    }
    onSocketMidiCommand(command) {
        switch (command.data.type) {
            case 'noteon':
                if (this.isAnimationControl(command.data.noteNumber)) {
                    this.emit('animation', command.data.noteNumber);
                }
                else {
                    this.instrumentManager.playMidiNoteWithChannel(command.data.noteNumber, command.data.velocity, command.data.channel);
                }
                break;
            case 'noteoff':
                this.instrumentManager.stopMidiNoteWithChannel(command.data.noteNumber, command.data.velocity, command.data.channel);
                break;
            case 'controlchange':
                this.instrumentManager.controlChangeWithChannel(command.data.channel, command.data);
                break;
        }
    }
    click() {
        this.instrumentManager.playMidiNoteWithChannel(60, 127, 11);
    }
    dataToMelody(data, timeInterval) {
        console.log(`WwMusic: MidiToMediaPlayer: dataToMelody: `, data);
        if (typeof data == 'string') {
            let tones = [];
            for (var i = 0; i < data.length; ++i) {
                let charCode = data.charCodeAt(i);
                tones.push((charCode - 25) % 23); // subtracting 25 aligns A with middle C (60)
            }
            this.instrumentManager.playTonesWithInstrument(tones, 'audio_dtm', timeInterval);
        }
    }
    dispose() {
        if (this.scheduleIntervalId) {
            clearInterval(this.scheduleIntervalId);
            this.scheduleIntervalId = null;
        }
        this.removeAllListeners();
    }
}
exports.MidiToMediaPlayer = MidiToMediaPlayer;
//# sourceMappingURL=MidiToMediaPlayer.js.map