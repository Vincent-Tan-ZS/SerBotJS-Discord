"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.constants = exports.typings = exports.fetch = void 0;
const auth_1 = require("./auth");
const findByUsername_1 = __importDefault(require("./methods/findByUsername"));
const findById_1 = __importDefault(require("./methods/findById"));
const getProgression_1 = __importDefault(require("./methods/getProgression"));
const getPlaytime_1 = __importDefault(require("./methods/getPlaytime"));
const getRanks_1 = __importDefault(require("./methods/getRanks"));
const getStats_1 = __importDefault(require("./methods/getStats"));
const getStatus_1 = __importDefault(require("./methods/getStatus"));
const getUserStatus_1 = __importDefault(require("./methods/getUserStatus"));
const getProfileApplications_1 = __importDefault(require("./methods/getProfileApplications"));
const getApplications_1 = __importDefault(require("./methods/getApplications"));
const validateUsername_1 = __importDefault(require("./methods/validateUsername"));
const custom_1 = __importDefault(require("./methods/custom"));
const getNews_1 = __importDefault(require("./methods/getNews"));
const getNewsById_1 = __importDefault(require("./methods/getNewsById"));
var fetch_1 = require("./fetch");
Object.defineProperty(exports, "fetch", { enumerable: true, get: function () { return __importDefault(fetch_1).default; } });
exports.typings = __importStar(require("./typings"));
exports.constants = __importStar(require("./constants"));
exports.utils = __importStar(require("./utils"));
const checkQueryLimit = ({ method, platform, query, options, limit }) => {
    const queryArray = Array.isArray(query) ? query : [query];
    if (queryArray.length > limit)
        return Promise.reject(new TypeError(`You can't pass more than ${limit} ids/usernames`));
    return platform ? method(platform, queryArray, options) : method(queryArray, options);
};
class R6API {
    constructor(options) {
        /** Find player by their username. */
        Object.defineProperty(this, "findByUsername", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (platform, query) => checkQueryLimit({ method: findByUsername_1.default, platform, query, limit: 50 })
        });
        /** Find player by their id. */
        Object.defineProperty(this, "findById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (platform, query, options) => checkQueryLimit({ method: findById_1.default, platform, query, options, limit: 50 })
        });
        /** Get playtime of a player. */
        Object.defineProperty(this, "getPlaytime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (platform, query) => checkQueryLimit({ method: getPlaytime_1.default, platform, query, limit: 200 })
        });
        /** Get level, xp and alpha pack drop chance of a player. */
        Object.defineProperty(this, "getProgression", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (platform, query) => checkQueryLimit({ method: getProgression_1.default, platform, query, limit: 200 })
        });
        /** Get seasonal stats of a player. */
        Object.defineProperty(this, "getRanks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (platform, query, options) => checkQueryLimit({ method: getRanks_1.default, platform, query, options, limit: 200 })
        });
        /** Get summary stats of a player. */
        Object.defineProperty(this, "getStats", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (platform, query, options) => checkQueryLimit({ method: getStats_1.default, platform, query, options, limit: 200 })
        });
        /** Get Rainbow Six: Siege servers status. */
        Object.defineProperty(this, "getStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: getStatus_1.default
        });
        /** Get status of a player. */
        Object.defineProperty(this, "getUserStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (query, options) => checkQueryLimit({ method: getUserStatus_1.default, query, options, limit: 50 })
        });
        /** Get information about applications of a player. */
        Object.defineProperty(this, "getProfileApplications", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (query, options) => checkQueryLimit({ method: getProfileApplications_1.default, query, options, limit: 100 })
        });
        /** Get information about applications. */
        Object.defineProperty(this, "getApplications", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (query) => checkQueryLimit({ method: getApplications_1.default, query, limit: 50 })
        });
        /** Validate username. */
        Object.defineProperty(this, "validateUsername", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: validateUsername_1.default
        });
        /** Useful if you're familiar with Rainbow Six Siege's API; this method will make a request to a custom URL you would provide with the token in the header. */
        Object.defineProperty(this, "custom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: custom_1.default
        });
        /** Get Rainbow Six: Siege News. */
        Object.defineProperty(this, "getNews", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: getNews_1.default
        });
        /** Get Rainbow Six: Siege News by ID. */
        Object.defineProperty(this, "getNewsById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: getNewsById_1.default
        });
        Object.defineProperty(this, "getAuth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.getAuth
        });
        Object.defineProperty(this, "getTicket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.getTicket
        });
        Object.defineProperty(this, "getToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.getToken
        });
        Object.defineProperty(this, "setCredentials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.setCredentials
        });
        Object.defineProperty(this, "setUbiAppId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.setUbiAppId
        });
        Object.defineProperty(this, "setAuthFileDirPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.setAuthFileDirPath
        });
        Object.defineProperty(this, "setAuthFileName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.setAuthFileName
        });
        Object.defineProperty(this, "setAuthFilePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.setAuthFilePath
        });
        Object.defineProperty(this, "getAuthFilePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: auth_1.getAuthFilePath
        });
        if (options.email && options.password)
            (0, auth_1.setCredentials)(options.email, options.password);
        if (options.ubiAppId)
            (0, auth_1.setUbiAppId)(options.ubiAppId);
        if (options.authFileDirPath)
            (0, auth_1.setAuthFileDirPath)(options.authFileDirPath);
        if (options.authFileName)
            (0, auth_1.setAuthFileName)(options.authFileName);
        if (options.authFilePath)
            (0, auth_1.setAuthFilePath)(options.authFilePath);
    }
}
exports.default = R6API;
//# sourceMappingURL=index.js.map