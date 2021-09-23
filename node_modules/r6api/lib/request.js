const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

Promise.promisifyAll(request);
module.exports = request;
