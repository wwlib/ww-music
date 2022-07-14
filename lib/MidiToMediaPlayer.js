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
class AudioContextClock {
    constructor(audioContextTime, localStartTime) {
        this._audioContextInitTime = 0; //seconds
        this._localInitTime = 0; // milliseconds
        this._localStartTime = 0;
        this._localStartTimeOffset = 0;
        this._localStartTime = localStartTime;
        console.log(`AudioContextClock: constructor: _localStartTime: ${this._localStartTime}`);
        this.init(audioContextTime);
    }
    get data() {
        return {
            audioContextInitTimeSeconds: this._audioContextInitTime,
            audioContextInitTimeMilliseconds: this._audioContextInitTime * 1000,
            localInitTimeMilliseconds: this._localInitTime,
            localStartTimeMilliseconds: this._localStartTime,
            localStartTimeOffsetMilliseconds: this._localStartTimeOffset,
            calculatedAcStartTimeSeconds: this.calculatedAcStartTime
        };
    }
    getAcTimeWithLocalTime(localTime) {
        const localTimeDelta = localTime - this._localInitTime; // + this._localInitTimeOffset
        return this._audioContextInitTime + localTimeDelta / 1000;
    }
    get calculatedAudioContextCurrentTime() {
        return this.getAcTimeWithLocalTime(new Date().getTime());
    }
    init(audioContextTime) {
        this._audioContextInitTime = audioContextTime;
        this._localInitTime = new Date().getTime();
        return this.data;
    }
    updateLocalStartTime(newLocalStartTime) {
        this._localStartTimeOffset = newLocalStartTime - this._localStartTime;
        console.log(`AudioContextClock: updateLocalStartTime: newLocalStartTime: ${newLocalStartTime}, _localStartTimeOffset: ${this._localStartTimeOffset}`);
    }
    get calculatedAcStartTime() {
        return this.getAcTimeWithLocalTime(this._localStartTime + this._localStartTimeOffset);
    }
}
exports.AudioContextClock = AudioContextClock;
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
            let noteNumber = event.noteNumber;
            let midiChannel = event.channel;
            let velocity = event.velocity;
            if (event.name === 'Note on') {
                if (this.isAnimationControl(noteNumber)) {
                    this.emit('animation', noteNumber);
                }
                else {
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
    setStartAtTime(startAtTime) {
        if (this.midiPlayerForEvents) {
            this.midiPlayerForEvents.setStartTime(startAtTime);
        }
        if (this.midiPlayerForScheduling) {
            this.midiPlayerForScheduling.setStartTime(startAtTime);
        }
        if (this._acClock) {
            this._acClock.updateLocalStartTime(startAtTime);
            console.log(`updating acClock local start time: ${startAtTime}`);
            console.log(JSON.stringify(this._acClock.data, null, 2));
        }
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
    playMidiFile(localStartTime) {
        if (this.fileLoaded) {
            this.midiPlayerForEvents.setStartTime(localStartTime);
            this.midiPlayerForEvents.play();
        }
        else {
            console.log(`WwMusic: MidiToMediaPlayer: playMidiFile: no file loaded`);
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
    scheduleAllNoteEvents(localStartTime, scheduleOptions, cb) {
        this._acClock = new AudioContextClock(this.instrumentManager.audioContext.currentTime, localStartTime);
        let currentTime = this._acClock.data.localInitTimeMilliseconds;
        this.midiPlayerForScheduling.setStartTime(localStartTime);
        console.log(`WwMusic: MidiToMediaPlayer: acClock.data: ${JSON.stringify(this._acClock.data, null, 2)}`);
        console.log(`WwMusic: MidiToMediaPlayer: current time: ${currentTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: target local start time: ${localStartTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: calculated audioContext start time: ${this._acClock.calculatedAcStartTime}`);
        console.log(`WwMusic: MidiToMediaPlayer: Tempo: ${this.midiPlayerForScheduling.tempo}`);
        console.log(`WwMusic: MidiToMediaPlayer: scheduleOptions:`, scheduleOptions);
        this.scheduleStartTime = currentTime;
        this.previousScheduleTime = 0;
        this.scheduleTimeSlice = 500; //miliseconds
        this.scheduleEvents(this._acClock.calculatedAcStartTime, scheduleOptions);
        this.scheduleIntervalId = setInterval(() => {
            let scheduledTicks = this.scheduleEvents(this._acClock.calculatedAcStartTime, scheduleOptions);
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