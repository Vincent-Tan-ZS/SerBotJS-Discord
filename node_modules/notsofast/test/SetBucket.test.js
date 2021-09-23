const Promise = require('bluebird');

const SetBucket = require('../SetBucket');
const expect = require('chai').expect;

describe('SetBucket', function () {

	let bucket;

	describe('add', function () {

		beforeEach(function () {
			bucket = new SetBucket(1);
		});

		it('Should add an item', function () {
			bucket.add({});
			expect(bucket.size()).to.equal(1);
		});

		it('Should return true if bucket is full', function () {
			expect(bucket.add({})).to.be.true;
			expect(bucket.add({})).to.be.false;
		});

	});

	describe('take', function () {

		beforeEach(function () {
			bucket = new SetBucket(2);
		});

		it('Should return a previously returned item', function () {
			const item1 = {};
			const item2 = {};
			bucket.add(item1);
			bucket.add(item2);

			expect(bucket.size()).to.equal(2);
			expect(bucket.take()).to.equal(item1);
			expect(bucket.size()).to.equal(1);
			expect(bucket.take()).to.equal(item2);
			expect(bucket.size()).to.equal(0);
		});

		it('Should return null if set was empty', function () {
			expect(bucket.take()).to.be.null;
		});

	});

});
