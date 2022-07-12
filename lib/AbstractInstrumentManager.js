"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AudioContextMock {
    get currentTime() {
        return new Date().getTime() / 1000;
    }
}
exports.AudioContextMock = AudioContextMock;
class AbstractInstrumentManager {
}
exports.AbstractInstrumentManager = AbstractInstrumentManager;
//# sourceMappingURL=AbstractInstrumentManager.js.map