const utils = require('./utils');

const config = require('../config');
const request = require('./request');
const E = require('./errors');

let notsofast;

if (!config.proxy) {
	notsofast = require('./loginRateLimiter');
}

const log = require('./logger');

module.exports = function () {
	if (config.proxy) {
		log.debug('Logging in via proxy');
		return request.getAsync({
			url: config.proxy
		})
		.get('body')
		.catch(function (err) {
			return Promise.reject(new E.AuthorizationError(err.message || err));
		});
	}
	log.debug('Getting a ratelimiter ticket');
	return notsofast()
		.then(function () {
			log.debug('Posting credentials to login');
			return request.postAsync({
				url: config[config.platform].loginurl,
				headers: {
					appId: '314d4fef-e568-454a-ae06-43e3bece12a6',
					Authorization: 'Basic ' + new Buffer(config.email + ':' + config.password, 'utf8').toString('base64'),
					'Ubi-AppId': '39baebad-39e5-4552-8c25-2c9b919064e2',
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: '{"rememberMe":true}'
			});
		})
		.catch(function (err) {
			return Promise.reject(new E.AuthorizationError(err.message || err));
		})
		.get('body')
		.then(utils.safeParse)
		.tap(function (body) {
			log.debug('Auth response body', body);
			if (body.errorCode) {
				if (body.message === 'Wrong Credentials') {
					return Promise.reject(new E.WrongCredentialsError());
				}
				return Promise.reject(new E.AuthorizationError(JSON.stringify(body)));
			}
			if (!body.ticket) {
				return Promise.reject(new Error('Login failed to return a ticket'));
			}
		});
};
