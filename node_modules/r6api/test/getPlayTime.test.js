const expect = require('chai').expect;
const Promise = require('bluebird');

describe('getPlayTime', function() {

	let command = require('../lib/commands/getPlayTime');
	let requestMock = function() {
		return Promise.resolve({
			body:`
{
	"results": {
		"abc": {
			"rankedpvp_timeplayed:infinite": 10,
			"casualpvp_timeplayed:infinite": 20
		}
	}
}
		`});
	};

	beforeEach(function() {});

	it('should return an array', function() {
		return command(requestMock, {}, {}, 'abc')
			.then(function (res) {
				expect(res).to.be.an('array');
			});
	});

	it('should return an array with objects with right properties', function () {
		return command(requestMock, {}, {}, 'abc')
			.then(function (res) {
				expect(res).to.not.be.empty;
				expect(res[0].id).to.equal('abc');
				expect(res[0].ranked).to.equal(10);
				expect(res[0].casual).to.equal(20);
			});
	});

	afterEach(function() {});

});
