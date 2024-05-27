import dayjs from 'dayjs';

export default class Stopwatch {
    constructor() {
        this._startTime = dayjs().valueOf();
        this._endTime = dayjs().valueOf();
        this._elapsedTime = 0;
    }

    Stop() {
        this._endTime = dayjs().valueOf();
        this._elapsedTime = this._endTime - this._startTime;
    }

    ShowElapsed(debugReason, channel) {
        console.log(`${debugReason}: ${this._elapsedTime}ms`);

        if (channel == undefined) return;

        channel.send({ content: `[Debug] Elapsed Time (${debugReason}): ${this._elapsedTime}ms` });
    }

    Reset() {
        this._startTime = dayjs().valueOf();
        this._endTime = dayjs().valueOf();
        this._elapsedTime = 0;
    }
}