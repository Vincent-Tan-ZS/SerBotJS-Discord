const request = require('./request');
const E = require('./errors');
const utils = require('./utils');
const log = require('./logger');

module.exports = function (params) {
	return request(params)
		.get('body')
		.then(utils.safeParse)
		.tap(function (body) {
			if (body.errorCode) {
				log.error('Request failed', body);
				if (body.errorCode === 3 || body.message === 'Ticket is expired') {
					return Promise.reject(new E.TokenExpiredError(JSON.stringify(body)));
				} else {
					return Promise.reject(new E.RequestError(JSON.stringify(body)));
				}
			}
		});
};
