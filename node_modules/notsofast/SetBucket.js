function Bucket(capacity) {
	this.capacity = capacity;
	this.queue = new Set();
}

Bucket.prototype.size = function () {
	return this.queue.size;
};

Bucket.prototype.add = function (item) {
	if (this.queue.size >= this.capacity) {
		return false;
	}
	this.queue.add(item);
	return true;
};

Bucket.prototype.take = function () {
	var item;
	for (item of this.queue) {
		break;
	}
	if (typeof item === 'undefined') {
		return null;
	}
	this.queue.delete(item);
	return item;
};

Bucket.prototype.remove = function (item) {
	return this.queue.delete(item);
};

Bucket.prototype.empty = function () {
	for (let item of this.queue) {
		item.reject(new Error('NotSoFast emptied'));
	}
	this.queue.clear();
};

module.exports = Bucket;
