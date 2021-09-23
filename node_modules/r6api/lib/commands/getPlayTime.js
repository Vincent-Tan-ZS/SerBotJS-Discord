const utils = require('../utils');
const array = require('ensure-array');
const _ = require('lodash');
const log = require('../logger');

module.exports = function (request, config, headers, ...ids) {
	log.info('getPlayTime', 'called with', ids.length, 'arguments');
	log.trace('getPlayTime', ids);
	if (ids.length > 200) {
		return Promise.reject(new E.InvalidParamatersError('Max amount of ids is 200 for getPlayTime'));
	}
	return request({
		url: config[config.platform].timeUrl + ids.join(','),
		headers: headers
	})
	.get('results')
	.then(function (res) {
		return _.map(res, function (obj, key) {
			return {
				id: key,
				casual: obj['casualpvp_timeplayed:infinite'],
				ranked: obj['rankedpvp_timeplayed:infinite']
			};
		});
	});
};
