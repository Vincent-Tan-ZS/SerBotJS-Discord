"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
exports.default = (platform, ids) => (0, auth_1.getToken)()
    .then((0, fetch_1.default)(utils_1.getURL.PROGRESS(platform, ids)))
    .then(res => res.player_profiles.map(profile => ({
    id: profile.profile_id,
    level: profile.level,
    xp: profile.xp,
    lootboxProbability: {
        raw: profile.lootbox_probability,
        percent: profile.lootbox_probability
            .toString()
            .replace(/\B(?=(\d{2})+(?!\d))/, '.') + '%'
    }
})));
//# sourceMappingURL=getProgression.js.map