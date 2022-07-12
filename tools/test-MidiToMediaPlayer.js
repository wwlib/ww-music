const path = require('path');
const findRoot = require('find-root');

const { MidiToMediaPlayer, InstrumentManagerMock } = require('../lib');

const instrumentManagerMock = InstrumentManagerMock.instance
const rootPath = findRoot()
const midiToMediaPlayer = new MidiToMediaPlayer(rootPath, instrumentManagerMock)
const midifile = 'twinkle_twinkle_3_chan.mid'
let startAtTime = new Date().getTime() + 1000
const scheduleOptions = {
    channelsToPlay: [2]
}
midiToMediaPlayer.loadMidiFile(midifile)

if (!startAtTime) {
    startAtTime = new Date().getTime();
}

// start scheduling (midiPlayerForScheduling)
// midiToMediaPlayer.on('scheduling', (data) => {
//     console.log(`scheduledTicks: ${data.scheduledTicks}, totalTicks: ${data.totalTicks}`);

// })
midiToMediaPlayer.scheduleAllNoteEvents(startAtTime, scheduleOptions, () => {
    console.log(`playMidiFile: done.`);
})

// start midi player (midiPlayerForEvents)
midiToMediaPlayer.on('note', (event) => {
    let indent = ''
    if (event.name === 'Note off') {
        indent = '    '
    }
    console.log(`event: ${event.tick}.${event.delta} ${indent} ${event.name} ${event.noteName}  - ${event.track}: ${event.channel}`);
})
midiToMediaPlayer.on('endOfFile', () => {
    console.log('endOfFile')
});
midiToMediaPlayer.playMidiFile(startAtTime)
