const utils = require('../utils');
const array = require('ensure-array');
const _ = require('lodash');
const Promise = require('bluebird');
const log = require('../logger');

const statmap = {
	matchesLost: 'generalpvp_matchlost:infinite',
	matchesWon: 'generalpvp_matchwon:infinite',
	kills: 'generalpvp_kills:infinite',
	deaths: 'generalpvp_death:infinite'
};

let regions = [
	'ncsa',
	'emea',
	'apac'
];

let plucks = [
	'max_mmr',
	'skill_mean',
	'abandons',
	'season',
	'region',
	'profile_id',
	'rank',
	'mmr',
	'wins',
	'skill_stdev',
	'losses',
	'max_rank'
];

let customizer = function (oldval, newval) {
	if (!oldval) {
		oldval = {};
	}
	oldval[newval.region] = newval;
	delete newval.region;

	oldval.season = newval.season;
	delete newval.season;

	oldval.id = newval.profile_id;
	delete newval.profile_id;

	return oldval;
 };

module.exports = function (request, config, headers, ...ids) {
	log.info('getRanks', 'called with', ids.length, 'arguments');
	log.trace('getRanks', ids);
	if (ids.length > 200) {
		return Promise.reject(new E.InvalidParamatersError('Max amount of ids is 200 for getRanks'));
	}
	let options = {
		season_id: -1
	};
	if (typeof ids[ids.length - 1] === 'object') {
		_.assign(options, ids.pop());
	}
	options.profile_ids = ids.join(',');
	return Promise.map(regions, function (region) {
		return request({
			url: config[config.platform].rankUrl,
			headers: headers,
			qs: _.assign({}, options, { region_id: region })
		})
		.get('players')
		.then(function (stats) {
			return _.mapValues(stats, function (stat) {
				return _.pick(stat, plucks);
			});
		});
	}).spread(function (ncsa, emea, apac) {
		return _.values(_.mergeWith({}, ncsa, emea, apac, customizer));
	});
};
