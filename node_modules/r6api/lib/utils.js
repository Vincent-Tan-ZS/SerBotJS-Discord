const Promise = require('bluebird');
const E = require('./errors');

exports.safeParse = function (value) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (e) {
		return Promise.reject(new E.ParseError(value));
	}
	return parsed;
};
