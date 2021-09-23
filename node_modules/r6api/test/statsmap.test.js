const _ = require('lodash');
const expect = require('chai').expect;

const statsobj = require('./fixtures/statsobj');
const statresult = require('./fixtures/statresult');

describe('statsmap', function () {

	let statmap = require('../lib/statsmap');

	it('should return all stat names', function () {
		let getters = statmap.getGetters([
			'casual',
			'ranked',
			'general',
			'secure',
			'hostage',
			'bomb',
			'weapon'
		]);
		let res = getters.reduce(function (acc, el) {
			_.set(acc, el.path.split(','), el.getter(statsobj));
			return acc;
		}, {});
		expect(res).to.eql(statresult);
	});

});