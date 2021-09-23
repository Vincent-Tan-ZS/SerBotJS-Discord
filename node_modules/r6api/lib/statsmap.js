const _ = require('lodash');
const operatorStats = require('./operatorStatInfo');

exports.getGetters = function (settings) {
	if (Array.isArray(settings)) {
		return getBySubgroups(settings);
	}
	return _(settings)
		.map(function (value, key) {
			if (value === true) {
				return getBySubgroups([key]);
			}
			if (typeof value === 'string') {
				return statMap[key + '.' + value];
			}
			if (Array.isArray(value)) {
				return value.map(function (stat) {
					return statArray.filter(function (getter) {
						return key + '.' + stat ===  getter.path;
					})[0];
				});
			}
		})
		.flatten()
		.filter(x => x)
		.value();
};

function getBySubgroups(subgroups) {
	return  _(statArray)
		.filter(function (obj) {
			return _.includes(subgroups, obj.path.split('.')[0]);
		})
		.value();
}

const statMap = {
	'casual.kills': makeSimpleGetter('casualpvp_kills'),
	'casual.deaths': makeSimpleGetter('casualpvp_death'),
	'casual.lost': makeSimpleGetter('casualpvp_matchlost'),
	'casual.played': makeSimpleGetter('casualpvp_matchplayed'),
	'casual.won': makeSimpleGetter('casualpvp_matchwon'),
	'casual.timePlayed': makeSimpleGetter('casualpvp_timeplayed'),

	'custom.timePlayed': makeSimpleGetter('custompvp_timeplayed'),

	'general.bulletsFired': makeSimpleGetter('generalpvp_bulletfired'),
	'general.bulletsHit': makeSimpleGetter('generalpvp_bullethit'),
	'general.headshot': makeSimpleGetter('generalpvp_headshot'),
	'general.deaths': makeSimpleGetter('generalpvp_death'),
	'general.assists': makeSimpleGetter('generalpvp_killassists'),
	'general.kills': makeSimpleGetter('generalpvp_kills'),
	'general.lost': makeSimpleGetter('generalpvp_matchlost'),
	'general.played': makeSimpleGetter('generalpvp_matchplayed'),
	'general.won': makeSimpleGetter('generalpvp_matchwon'),
	'general.meleeKills': makeSimpleGetter('generalpvp_meleekills'),
	'general.penetrationKills': makeSimpleGetter('generalpvp_penetrationkills'),
	'general.revives': makeSimpleGetter('generalpvp_revive'),
	'general.timePlayed': makeSimpleGetter('generalpvp_timeplayed'),

	'general.blindKills': makeSimpleGetter('generalpvp_blindkills'),
	'general.dbno': makeSimpleGetter('generalpvp_dbno'),
	'general.dbnoAssists': makeSimpleGetter('generalpvp_dbnoassists'),
	'general.gadgetsDestroyed': makeSimpleGetter('generalpvp_gadgetdestroy'),
	'general.hostageDefense': makeSimpleGetter('generalpvp_hostagedefense'),
	'general.hostageRescue': makeSimpleGetter('generalpvp_hostagerescue'),
	'general.rappelBreaches': makeSimpleGetter('generalpvp_rappelbreach'),
	'general.revivesDenied': makeSimpleGetter('generalpvp_revivedenied'),
	'general.serverAggression': makeSimpleGetter('generalpvp_serveraggression'),
	'general.serverDefender': makeSimpleGetter('generalpvp_serverdefender'),
	'general.serversHacked': makeSimpleGetter('generalpvp_servershacked'),
	'general.suicides': makeSimpleGetter('generalpvp_suicide'),

	'ranked.kills': makeSimpleGetter('rankedpvp_kills'),
	'ranked.deaths': makeSimpleGetter('rankedpvp_death'),
	'ranked.lost': makeSimpleGetter('rankedpvp_matchlost'),
	'ranked.played': makeSimpleGetter('rankedpvp_matchplayed'),
	'ranked.won': makeSimpleGetter('rankedpvp_matchwon'),
	'ranked.timePlayed': makeSimpleGetter('rankedpvp_timeplayed'),

	'secure.bestScore': makeSimpleGetter('secureareapvp_bestscore'),
	'secure.lost': makeSimpleGetter('secureareapvp_matchlost'),
	'secure.played': makeSimpleGetter('secureareapvp_matchplayed'),
	'secure.won': makeSimpleGetter('secureareapvp_matchwon'),

	'hostage.bestScore': makeSimpleGetter('rescuehostagepvp_bestscore'),
	'hostage.lost': makeSimpleGetter('rescuehostagepvp_matchlost'),
	'hostage.played': makeSimpleGetter('rescuehostagepvp_matchplayed'),
	'hostage.won': makeSimpleGetter('rescuehostagepvp_matchwon'),

	'bomb.bestScore': makeSimpleGetter('plantbombpvp_bestscore'),
	'bomb.lost': makeSimpleGetter('plantbombpvp_matchlost'),
	'bomb.played': makeSimpleGetter('plantbombpvp_matchplayed'),
	'bomb.won': makeSimpleGetter('plantbombpvp_matchwon'),

	'weapon.headshot': makeWeaponGetter('weapontypepvp_headshot'),
	'weapon.bulletsFired': makeWeaponGetter('weapontypepvp_bulletfired'),
	'weapon.bulletsHit': makeWeaponGetter('weapontypepvp_bullethit'),
	'weapon.kills': makeWeaponGetter('weapontypepvp_kills'),

	'operator.tachanka.gadgetPvp': makeChankaGetter()

};

_.forEach(operatorStats, function (stats, name) {
	statMap[`operator.${name}.kills`] = makeOperatorGetter('operatorpvp_kills', stats.index);
	statMap[`operator.${name}.deaths`] = makeOperatorGetter('operatorpvp_death', stats.index);
	statMap[`operator.${name}.won`] = makeOperatorGetter('operatorpvp_roundwon', stats.index);
	statMap[`operator.${name}.lost`] = makeOperatorGetter('operatorpvp_roundlost', stats.index);
	statMap[`operator.${name}.timePlayed`] = makeOperatorGetter('operatorpvp_timeplayed', stats.index);
});

const statArray = _.map(statMap, function (getter, path) {
	return {
		getter: getter,
		path: path
	};
});

exports.translateStats = function (stats) {
	let result = {};
};

function makeOperatorGetter(key, index) {
	let propkey = `${key}:${index}:infinite`;
	let getter = function (obj) {
		return obj[propkey] === undefined ? null : obj[propkey];
	};

	getter.propName = key;
	return getter;
}

function makeSimpleGetter(key) {
	let getter = function (obj) {
		return obj[key + ':infinite'] === undefined ? null : obj[key + ':infinite'];
	};
	getter.propName = key;
	return getter;
}

const weaponMap = {
	1: 'assault',
	2: 'smg',
	3: 'lmg',
	4: 'sniper',
	5: 'pistol',
	6: 'shotgun',
	7: 'mp',
	8: 'shield',
	9: 'launcher',
	B: 'B'
};

function makeChankaGetter() {
	let getter = function (obj) {
		return _.get(obj, 'operatorpvp_tachanka_turretkill:5:4:infinite', null);
	};
	getter.propName = 'operatorpvp_tachanka_turretkill';
	return getter;
}

function makeWeaponGetter(key) {
	let getter = function (obj) {
		let res = _.reduce(weaponMap, function (res, name, id) {
			if (obj[key + ':' + id + ':infinite'] !== undefined) {
				res[name] = obj[key + ':' + id + ':infinite'];
				res[name] = typeof res[name] === 'undefined' ? null : res[name];
			}
			return res;
		}, {});
		return Object.keys(res).length ? res :  null;

	};
	getter.propName = key;
	return getter;
}
