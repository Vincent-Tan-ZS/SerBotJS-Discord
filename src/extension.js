import { Formatters } from 'discord.js';

Object.defineProperty(String.prototype, "ToBold", {
    value: function ToBold() {
        return Formatters.bold(this);
    },
    writable: true,
    configurable: true
});

Object.defineProperty(String.prototype, "ToCodeBlock", {
    value: function ToCodeBlock() {
        return Formatters.bold(this);
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