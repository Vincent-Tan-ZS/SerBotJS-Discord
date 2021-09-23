const utils = require('../utils');
const array = require('ensure-array');
const log = require('../logger');

module.exports = function (request, config, headers, name) {
	log.info('findByName called for', name);
	return request({
		url: config[config.platform].url + name,
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
