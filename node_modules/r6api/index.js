const config = require('./config');
const _ = require('lodash');

module.exports = function (conf, loggerSettings) {
	if (loggerSettings) {
		let logger = require('./lib/logger');
		logger.logLevel = loggerSettings.logLevel || 2,
		_.assign(logger.outputters, loggerSettings.outputters);
	}
	_.assign(config, conf);
	if (!config.email.length || !config.password.length) {
		throw new Error('UBI ERROR: email or password empty');
	}
	return require('./lib/api');
};
