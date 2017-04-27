const ac = new AudioContext()
const pie = require('pie-ano')(ac)

export class PieAnoManager {

    static connected: boolean;

    static init(): void {
        console.log(`PieAnoManager: init:`);
        PieAnoManager.connected = false;
    }

    static connect(): void {
        if (!PieAnoManager.connected) {
            pie.connect(ac.destination);
            PieAnoManager.connected = true;
        }
    }

    static playMidiNote(noteNumber: number): void {
        console.log(`PieAnoManager: playMidiNote: ${noteNumber}`);
        PieAnoManager.connect();
        pie.update({ midiNote: noteNumber, attack: 0.0, decay: 0.0, sustain: 0.1, release: 0.1, peak: 0.05, mid: 0.1 }, ac.currentTime);
        pie.start(ac.currentTime);
    }

    static test(): void {
        console.log(`PieAnoManager: init`);
        pie.connect(ac.destination);
        pie.update({ midiNote: 70, attack: 0.25, decay: 0.2, sustain: 0.3, release: 0.1, peak: 0.5, mid: 0.3 }, ac.currentTime)
        pie.start(ac.currentTime)

        pie.update({ midiNote: 67, attack: 0.25, decay: 0.2, sustain: 0.3, release: 0.1, peak: 0.5, mid: 0.3 }, ac.currentTime + 0.5)
        pie.start(ac.currentTime + 1)

        pie.update({ midiNote: 72, attack: 0.25, decay: 0.2, sustain: 0.3, release: 0.1, peak: 0.5, mid: 0.3 }, ac.currentTime + 1.5)
        pie.start(ac.currentTime + 2)

        // pie.connect(ac.destination)
        //
        // // set the frequency/ADSR
        // pie.update({ midiNote: 72, attack: 0.3, decay: 0.1, sustain: 0.3, release: 0.5, peak: 0.5, mid: 0.3, end: 0.00000001 })
        // // and trigger it!
        // pie.start(ac.currentTime)
        //
        //
        // // destroy the oscillators completely. u probably would only wanna do this for garbage collection porpoises.
        // pie.stop(ac.currentTime)
        //
        // // this will return an object containing all the nodes in the pie-ano audioGraph, for closer-to-the-metal manipulation than the update/start methods provide.
        // console.log(`PieAnoManager: test: pie.nodes():`, pie.nodes());
    }

}
