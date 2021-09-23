const _ = require('lodash');

function Bucket() {
	this.queue = [];
}

Bucket.prototype.add = function (item) {
	this.queue.push(item);
};

Bucket.prototype.take = function () {
	return this.queue.shift();
};

Bucket.prototype.remove = function (item) {
	return _.pull(this.queue, item).length ? true : false;
};

module.exports = Bucket;
