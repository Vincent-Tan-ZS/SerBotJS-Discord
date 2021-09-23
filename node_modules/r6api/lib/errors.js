const subclassError = require('subclass-error');

exports.AuthorizationError = subclassError('AuthorizationError');
exports.WrongCredentialsError = subclassError('WrongCredentialsError', exports.AuthorizationError, {});
exports.TokenExpiredError = subclassError('TokenExpiredError', exports.AuthorizationError, {});
exports.ParseError = subclassError('ParseError');

exports.InvalidParametersError = subclassError('InvalidParametersError');
exports.RequestError = subclassError('RequestError');
