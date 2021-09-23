const Promise = require('bluebird');
const SetBucket = require('./SetBucket');
const SubclassError = require('subclass-error');

module.exports = function (opts) {

	opts.timeout = parseInt(opts.timeout, 10) || 5000;
	opts.interval = parseInt(opts.interval, 10) || 1000;
	opts.ticketsPerInterval = parseInt(opts.ticketsPerInterval, 10);
	if (!opts.ticketsPerInterval) {
		throw new Error('NotSoFast: ticketsPerInterval is required');
	}
	opts.bucketSize = parseInt(opts.bucketSize) || opts.ticketsPerInterval;

	const bucket = new SetBucket(opts.bucketSize);
	let freeTickets = opts.ticketsPerInterval;

	const interval = setInterval(function replenish () {
		freeTickets = opts.ticketsPerInterval;
		drip();
	}, opts.interval);

	function drip() {
		let ticket;
		while(freeTickets-- > 0) {
			ticket = bucket.take();
			if (ticket === null) {
				break;
			}
			clearTimeout(ticket.timeout);
			ticket.resolve();
		}
	}

	const limiter = function () {

		let timeout;

		return new Promise(function (resolve, reject) {
			let t = setTimeout(function () {
				bucket.remove(ticket);
				reject(new module.exports.timeoutError());
			}, opts.timeout);
			const ticket = {
				timeout: t,
				resolve: resolve,
				reject: reject
			};
			if (freeTickets > 0) {
				resolve();
				freeTickets--;
				return;
			}
			var didAdd = bucket.add(ticket);
			if (!didAdd) {
				ticket.reject(new module.exports.bucketFullError());
			}
		});

	};

	limiter.stop = function () {
		clearInterval(interval);
		bucket.empty();
	};

	limiter.timeoutError = module.exports.timeoutError;
	limiter.bucketFullError = module.exports.bucketFullError;

	return limiter;

};

module.exports.timeoutError = SubclassError('Timeout');
module.exports.bucketFullError = SubclassError('Bucket full');
