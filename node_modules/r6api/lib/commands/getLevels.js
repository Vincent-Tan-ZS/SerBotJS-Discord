const _ = require('lodash');
const log = require('../logger');
const array = require('ensure-array');

module.exports = function (request, config, headers, ...args) {
	log.info('getLevels', 'called with', args.length, 'arguments');
	log.trace('getLevels', args);
	if (args.length > 40) {
		return Promise.reject(new E.InvalidParamatersError('Max amount of ids is 200 for getLevels'));
	}
	return request({
		url: config[config.platform].levelUrl + 'profile_ids=' + args.join(','),
		headers: headers
	})
	.get('player_profiles')
	.then(array)
	.map(x => ({
			id: x.profile_id,
			level: x.level
	}));
};
