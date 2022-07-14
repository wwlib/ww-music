var assert = require('assert');
var AudioNote = require('../lib/AudioNote').AudioNote;
const { AudioContextClock } = require('../lib')
var instrumentConfig = require('../data/instrument_config.json');

describe('WwMusic', function() {
	describe('#AudioInstrument', function () {
		describe('#IntrumentConfigData', function () {
			var pianoData = instrumentConfig[14];
			var noteData = pianoData.notes[0];
			it('midi note number should be 48', function () {
				assert.equal(48, noteData.midi);
			});
		});
		describe('#AudioNote()', function () {
			var pianoData = instrumentConfig[14];
			var noteData = pianoData.notes[0];
			console.log(AudioNote.AudioNote);
			var note = new AudioNote(noteData, pianoData.tempo, pianoData.divisions, pianoData.offsetInDivisions || 0, pianoData.fileOffset);
			it('AudioNote note number should be 48', function () {
				assert.equal(48, note.noteNumber);
			});
		});
	});

	describe('AudioContextClock', function() {
		describe('#Time Calculations 1', function() {
			const fakeAudioContextCurrentTime = 30.123
			const acClock = new AudioContextClock(fakeAudioContextCurrentTime)
			const localInitTime = acClock.data.localInitTimeMilliseconds
			acClock.setLocalStartTime(localInitTime)
			console.log(acClock.data)
			it('audioContextInitTimeSeconds should be initilized correctly', function() {
				assert.equal(acClock.data.audioContextInitTimeSeconds, fakeAudioContextCurrentTime)
			})
			it('calculatedAcStartTime should equal fakeAudioContextCurrentTime', function() {
				assert.equal(acClock.calculatedAcStartTime, fakeAudioContextCurrentTime)
			})
		})
		describe('#Time Calculations: change local start time', function() {
			const fakeAudioContextCurrentTime = 30.123
			const acClock = new AudioContextClock(fakeAudioContextCurrentTime)
			const localInitTime = acClock.data.localInitTimeMilliseconds
			acClock.setLocalStartTime(localInitTime + 1000)
			console.log(acClock.data)
			it('calculatedAcStartTime should equal fakeAudioContextCurrentTime + 1sec', function() {
				assert.equal(acClock.calculatedAcStartTime, fakeAudioContextCurrentTime + 1)
			})
		})
		describe('#Time Calculations: update local start time', function() {
			const fakeAudioContextCurrentTime = 30.123
			const acClock = new AudioContextClock(fakeAudioContextCurrentTime)
			const localInitTime = acClock.data.localInitTimeMilliseconds
			acClock.setLocalStartTime(localInitTime + 1000)
			acClock.updateLocalStartTime(localInitTime + 1000 - 50)
			console.log(acClock.data)
			it('calculatedAcStartTime should equal fakeAudioContextCurrentTime + 1sec - 0.050sec', function() {
				assert.equal(acClock.calculatedAcStartTime, fakeAudioContextCurrentTime + 1 - 0.050)
			})
		})
	})
});
