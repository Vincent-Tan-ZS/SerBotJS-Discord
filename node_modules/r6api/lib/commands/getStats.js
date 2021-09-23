const utils = require('../utils');
const array = require('ensure-array');
const _ = require('lodash');
const log = require('../logger');

const statsmap = require('../statsmap');

const defaultStats = {
	general: ['lost', 'won', 'kills', 'deaths']
};

module.exports = function (request, config, headers, ...args) {
	log.info('getStats', 'called with', args.length, 'arguments');
	log.trace('getStats', args);
	let settings;
	if (typeof args[args.length - 1] === 'object') {
		settings = args.pop();
	}
	if (args.length > 200) {
		return Promise.reject(new E.InvalidParamatersError('Max amount of ids is 200 for getStats'));
	}
	let getters = statsmap.getGetters(settings || defaultStats);
	let urlstats = _.uniq(getters
		.map(x => x.getter.propName)).join(',');
	if (!urlstats.length) {
		return Promise.reject(new E.InvalidParamatersError('Wrong stat names'));
	}
	return request({
		url: config[config.platform].statsUrl + 'statistics=' + urlstats + '&populations=' +  args.join(','),
		headers: headers
	})
	.get('results')
	.then(function (res) {
		return _.map(res, function (obj, key) {
			let stat = {
				id: key
			};
			_.forEach(getters, function (getter, key) {
				_.set(stat, getter.path.split('.'), getter.getter(obj));
			});
			return stat;
		});
	});
};
