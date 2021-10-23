"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const auth_1 = require("./auth");
const promiseTimeout = (promise, ms, reject = true) => Promise.race([promise, new Promise((res, rej) => setTimeout(() => reject ? rej : res, ms))]);
exports.default = (url, options = {}) => async (token) => {
    const { headers, ...optionsRest } = options;
    const response = await (0, node_fetch_1.default)(url, {
        ...{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Ubi-AppId': auth_1.ubiAppId,
                ...token && { 'Authorization': token },
                ...headers && { ...headers }
            }
        },
        ...optionsRest && { ...optionsRest }
    });
    const handleResponse = async (res) => {
        if (res.ok)
            return res.json();
        else {
            const body = await res.text();
            let json;
            try {
                json = JSON.parse(body);
            }
            catch (error) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            throw new Error(json.httpCode || json.message
                ? `${json.httpCode} ${json.message}${json.moreInfo ? `\n\n${json.moreInfo}` : ''}`
                : JSON.stringify(json));
        }
    };
    return promiseTimeout(handleResponse(response), 10000);
};
//# sourceMappingURL=fetch.js.map