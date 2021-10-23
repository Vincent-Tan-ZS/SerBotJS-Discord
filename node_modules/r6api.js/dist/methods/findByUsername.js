"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
exports.default = (platform, username) => (0, auth_1.getToken)()
    .then((0, fetch_1.default)(utils_1.getURL.BYUSERNAME(platform, username)))
    .then(res => res.profiles.map(profile => ({
    id: profile.profileId,
    userId: profile.userId,
    idOnPlatform: profile.idOnPlatform,
    platform: profile.platformType,
    username: profile.nameOnPlatform,
    avatar: (0, utils_1.getAvatars)(profile.userId)
})));
//# sourceMappingURL=findByUsername.js.map