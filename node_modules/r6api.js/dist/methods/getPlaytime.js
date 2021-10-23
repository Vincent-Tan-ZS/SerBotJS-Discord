"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
const statGetter = (obj, id, stat, type) => obj.results[id][`${stat}${type}_timeplayed:infinite`]
    || 0;
exports.default = (platform, ids) => (0, auth_1.getToken)()
    .then((0, fetch_1.default)(utils_1.getURL.PLAYTIME(platform, ids)))
    .then(res => Object.keys(res.results).map(id => ({
    id,
    pvp: {
        general: statGetter(res, id, 'general', 'pvp'),
        ranked: statGetter(res, id, 'ranked', 'pvp'),
        casual: statGetter(res, id, 'casual', 'pvp'),
        custom: statGetter(res, id, 'custom', 'pvp'),
        other: statGetter(res, id, 'general', 'pvp') -
            (statGetter(res, id, 'ranked', 'pvp') +
                statGetter(res, id, 'casual', 'pvp') +
                statGetter(res, id, 'custom', 'pvp'))
    },
    pve: {
        general: statGetter(res, id, 'general', 'pve')
    }
})));
//# sourceMappingURL=getPlaytime.js.map