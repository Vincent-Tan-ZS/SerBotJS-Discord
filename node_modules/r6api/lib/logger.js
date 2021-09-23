const moment = require('moment');

const abbrvs = {
	trace: 'TRC',
	debug: 'DBG',
	info: 'INF',
	warn: 'WRN',
	error: 'ERR',
	fatal: 'FTL'
};

const levels = {
	trace: 0,
	debug: 1,
	info: 2,
	warn: 3,
	error: 4,
	fatal: 5
};

function makeOutputter(level) {
	return function (message) {
		console.log(moment().format() + `[${abbrvs[level]}]` + message);
	};
}

function makeLogger(level) {
	return function (...args) {
		if (levels[level] < exports.logLevel) {
			return null;
		}
		let output = args.map(function (message) {
			if (message instanceof Error) {
				return message.stack;
			}
			if (typeof message === 'object') {
				try {
					message = JSON.stringify(message);
					return message;
				} catch (e) {
					return message.toString();
				}
			}
			return message;
		});
		return exports.outputters[level](output.join(' '));
	};
}

exports.outputters = {};

Object.keys(levels).forEach(function (level) {
	exports.outputters[level] = makeOutputter(level);
	exports[level] = makeLogger(level);
});

exports.logLevel = 0;
