const utils = require('../utils');
const array = require('ensure-array');
const log = require('../logger');

module.exports = function (request, config, headers, ...ids) {
	log.info('getCurrentName', 'called with', ids.length, 'arguments');
	log.trace('getCurrentName', ids);
	if (ids.length > 40) {
		return Promise.reject(new E.InvalidParamatersError('Max amount of ids is 40 for getCurrentName'));
	}
	return request({
		url: config[config.platform].reverseUrl + ids.join(','),
		headers: headers
	})
	.get('profiles')
	.then(array)
	.map(x => ({
			id: x.profileId,
			userId: x.userId,
			name: x.nameOnPlatform
	}));
};
