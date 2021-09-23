const Promise = require('bluebird');
const NotSoFast = require('../index');
const expect = require('chai').expect;

describe('Not So Fast', function () {

	let notsofast;

	beforeEach(function () {
		notsofast = NotSoFast({
			bucketSize: 1,
			ticketsPerInterval: 1,
			interval: 1000,
			timeout: 1500
		});
	});

	it('Should resolve the promise', function (next) {
		notsofast()
			.then(next)
			.catch(function (err) {
				console.log('error', err);
				next(new Error('Fail'));
			});
	});

	it('Should resolve the promise instantly if tickets are available',
		function (next) {
			let prom = notsofast().catch(err => {
				next(err);
			});
			Promise
				.resolve()
				.timeout(100)
				.then(function () {
					if (prom.isFulfilled() === false) {
						return next(new Error('Promise wasn\'t fulfilled in time'));
					}
					next();
				})
				.finally(notsofast.stop());
		});

	it('Should reject instantly if bucket size has been exceeded',
		function (next) {
			let rejections = 0;
			let promises = [
				notsofast(),
				notsofast(),
				notsofast()
					.catch(x => {
						rejections++;
					})
			];
			Promise.all(promises).then(function () {
				if (rejections !== 1) {
					console.log('NO REJECT');
					return next(new Error('Promise wasn\'t instantly rejected'));
				}
				next();
			}).catch(next);
		});

	it('Should not resolve more promises in interval than possible',
		function (next) {
			let prom1 = notsofast();
			let prom2 = notsofast();
			let timeout = Promise
				.resolve()
				.timeout(100)
				.then(function () {
					expect(prom1.isFulfilled()).to.be.true;
					expect(prom2.isFulfilled()).to.be.false;
					next();
				});
		});

});
