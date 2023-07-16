import { bold } from 'discord.js';


Object.defineProperty(String.prototype, "ToBold", {
    value: function ToBold() {
        return bold(this);
    },
    writable: true,
    configurable: true
});

Object.defineProperty(String.prototype, "FirstDigitIndex", {
    value: function FirstDigitIndex() {
        return this.search(/\d/);
    },
    writable: true,
    configurable: true
});