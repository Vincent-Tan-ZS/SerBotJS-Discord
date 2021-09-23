const S = 1000;
const M = 60 * S;

module.exports = require('notsofast')({
	timeout: 10 * M,
	interval: 10 * M,
	ticketsPerInterval: 1,
	bucketSize: 1
});
