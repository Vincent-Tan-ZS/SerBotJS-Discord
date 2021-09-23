const config = require('../config');

const Promise = require('bluebird');
const auth = require('./auth');
const moment = require('moment');
const S = 1000;
const M = 60 * S;
const H = 60 * M;

let loginTimeout;
let expirationTimeout;
let activeLogin;

headers = {
	'Ubi-AppId': '39baebad-39e5-4552-8c25-2c9b919064e2'
};

exports.login = function () {
	if (activeLogin) {
		log.debug('Login called but a login is already active');
		return Promise.resolve();
	}
	clearTimeout(loginTimeout);
	clearTimeout(expirationTimeout);
	activeLogin = true;
	headers.Authorization = auth()
		.then(function (response) {
			if (typeof response === 'object') {
				let expiration = moment(response.expiration);
				let ubiTime = moment(response.serverTime);
				let expiry = expiration.subtract('10', 's').diff(ubiTime, 'ms');
				expirationTimeout = setTimeout(function () {
					headers.Authorization = null;
					expirationTimeout = null;
				}, expiry);
			}
			if (response && (response.length || (response.ticket && response.ticket.length))) {
				return response.ticket ? 'Ubi_v1 t=' + response.ticket : response;
			}
			return Promise.reject(new Error('Login failed to return a ticket'));
		})
		.finally(function () {
			activeLogin = false;
		});
	if (config.autoRefresh) {
		loginTimeout = config.setTimeout(login, 2 * H);
	}
	return Promise.resolve();
};

exports.getHeaders = function () {
	if (!headers.Authorization || config.alwaysLogin) {
		return exports.login()
			.then(function () {
				return Promise.props(headers);
			});
	}
	return Promise.props(headers);
};

exports.invalidate = function () {
	clearTimeout(expirationTimeout);
	headers.Authorization = null;
};

exports.stop = function () {
	clearTimeout(loginTimeout);
	clearTimeout(expirationTimeout);
};

if (config.autoRefresh) {
	exports.login();
}
