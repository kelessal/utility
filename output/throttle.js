"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Throttle {
    constructor(fn, timeout) {
        this.timeout = timeout || 100;
        this.handler = fn;
    }
    fire() {
        if (this.clearTimeout)
            return;
        this.clearTimeout = setTimeout(() => {
            this.clearTimeout = undefined;
            this.handler();
        }, this.timeout);
    }
}
exports.default = Throttle;
//# sourceMappingURL=throttle.js.map