var assert = require('assert');
var AudioNote = require('../lib/AudioNote').AudioNote;
var instrumentConfig = require('../data/instrument_config.json');

describe('WwMusic', function() {
	describe('#AudioInstrument', function () {
		describe('#IntrumentConfigData', function () {
			var bassData = instrumentConfig[14];
			var noteData = bassData.notes[0];
			it('midi note number should be 36', function () {
				assert.equal(36, noteData.midi);
			});
		});
		describe('#AudioNote()', function () {
			var bassData = instrumentConfig[14];
			var noteData = bassData.notes[0];
			console.log(AudioNote.AudioNote);
			var note = new AudioNote(noteData, bassData.tempo, bassData.divisions, bassData.offsetInDivisions, bassData.fileOffset);
			it('AudioNote note number should be 36', function () {
				assert.equal(36, note.noteNumber);
			});
		});
	});
});
