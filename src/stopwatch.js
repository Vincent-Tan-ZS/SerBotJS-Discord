import moment from 'moment-timezone';

export default class Stopwatch {
    constructor() {
        this._startTime = moment();
        this._endTime = moment();
        this._ellapsedTime = "0";
    }

    Stop() {
        this._endTime = moment();
        this._ellapsedTime = this._endTime.subtract(this._startTime).format("SSS");
    }

    ShowEllapsed(channel) {
        console.log(`${this._ellapsedTime}ms`);

        if (channel == undefined) return;

        channel.send({ content: `[Debug] Ellapsed Time: ${this._ellapsedTime}ms` });
    }
}