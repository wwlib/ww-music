var assert = require('assert');
var AudioNote = require('../lib/AudioNote').AudioNote;
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
});
