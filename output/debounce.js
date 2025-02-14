"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Debounce {
    constructor(fn, timeout) {
        this.timeout = timeout || 100;
        this.handler = fn;
    }
    fire() {
        if (this.clearTimeout) {
            clearTimeout(this.clearTimeout);
            this.clearTimeout = undefined;
        }
        const self = this;
        const args = arguments;
        self.clearTimeout = setTimeout(() => {
            self.clearTimeout = undefined;
            self.handler.apply(self, args);
        }, self.timeout);
    }
}
exports.default = Debounce;
//# sourceMappingURL=debounce.js.map