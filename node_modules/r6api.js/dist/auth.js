"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthFilePath = exports.setAuthFilePath = exports.setAuthFileName = exports.setAuthFileDirPath = exports.setUbiAppId = exports.setCredentials = exports.getToken = exports.getTicket = exports.getAuth = exports.login = exports.ubiAppId = void 0;
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = require("fs");
const fetch_1 = __importDefault(require("./fetch"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const TEN_MIN_IN_MS = 10 * 60 * 1000;
const credentials = { email: '', password: '' };
let LOGIN_TIMEOUT;
exports.ubiAppId = constants_1.ubiAppId;
let authFileDirPath = (0, os_1.tmpdir)();
let authFileName = 'r6api.js-auth.json';
let authFilePath = null;
const getExpiration = (auth) => +new Date(auth.expiration) - +new Date() - TEN_MIN_IN_MS;
const login = async () => {
    const lastAuth = await fs_1.promises.readFile((0, exports.getAuthFilePath)(), 'utf8')
        .then((auth) => JSON.parse(auth))
        .catch(() => '');
    if (lastAuth && getExpiration(lastAuth) > 0) {
        setNextLogin(lastAuth);
        return lastAuth;
    }
    const token = 'Basic ' + Buffer
        .from(`${credentials.email}:${credentials.password}`, 'utf8')
        .toString('base64');
    return (0, fetch_1.default)(utils_1.getURL.LOGIN(), {
        method: 'POST',
        body: JSON.stringify({ rememberMe: true })
    })(token)
        .then(async (res) => {
        if (res && res.ticket && res.expiration) {
            await fs_1.promises.writeFile((0, exports.getAuthFilePath)(), JSON.stringify(res));
            return res;
        }
        else
            throw new Error(`No response from login: ${JSON.stringify(res)}`);
    })
        .catch(err => {
        clearTimeout(LOGIN_TIMEOUT);
        throw err;
    });
};
exports.login = login;
const setNextLogin = async (auth) => {
    clearTimeout(LOGIN_TIMEOUT);
    LOGIN_TIMEOUT = setTimeout(() => (0, exports.login)(), getExpiration(auth));
};
const getAuth = () => (0, exports.login)();
exports.getAuth = getAuth;
const getTicket = () => (0, exports.login)().then(auth => auth.ticket);
exports.getTicket = getTicket;
const getToken = () => (0, exports.login)().then(auth => `Ubi_v1 t=${auth.ticket}`);
exports.getToken = getToken;
const setCredentials = (email, password) => {
    credentials.email = email;
    credentials.password = password;
};
exports.setCredentials = setCredentials;
const setUbiAppId = (_ubiAppId) => { exports.ubiAppId = _ubiAppId; };
exports.setUbiAppId = setUbiAppId;
const setAuthFileDirPath = (path) => { authFileDirPath = path; };
exports.setAuthFileDirPath = setAuthFileDirPath;
const setAuthFileName = (name) => { authFileName = `${name}.json`; };
exports.setAuthFileName = setAuthFileName;
const setAuthFilePath = (path) => { authFilePath = path; };
exports.setAuthFilePath = setAuthFilePath;
const getAuthFilePath = () => authFilePath || (0, path_1.join)(authFileDirPath, authFileName);
exports.getAuthFilePath = getAuthFilePath;
//# sourceMappingURL=auth.js.map