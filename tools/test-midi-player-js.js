const path = require('path');
const findRoot = require('find-root');
const MidiPlayer = require('midi-player-js');

const midiPlayer = new MidiPlayer.Player((event) => {
    let indent = ''
    if (event.name === 'Note off') {
        indent = '    '
    }
    console.log(`event: ${event.tick}.${event.delta} ${indent} ${event.name} ${event.noteName} - ${event.track}: ${event.channel}`) // , event);
    if (event.data) console.log(event.data)
    if (event.string) console.log(event.string)
    if (event.timeSignature) console.log(event.timeSignature)
})

const rootPath = findRoot()
const filename = 'twinkle_twinkle_3_chan.mid'
console.log('rootPath:', rootPath)
const filePath = path.join(rootPath, 'midi', filename);
console.log('filePath:', filePath)
midiPlayer.loadFile(filePath)

console.log('midiPlayer.division:', midiPlayer.division)
console.log('deltas:')
midiPlayer.tracks.forEach(track => console.log(track.delta))
console.log('')
console.log(midiPlayer.getTotalTicks())
console.log(midiPlayer.totalTicks)


const startTime = new Date().getTime()
midiPlayer.setStartTime(startTime);
// midiPlayer.on('playing', (data) => {
//     console.log(`playing:`, data)
// })
midiPlayer.on('endOfFile', () => {
    console.log('endOfFile')
});
midiPlayer.play()
