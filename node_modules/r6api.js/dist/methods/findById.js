"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsDocs = void 0;
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
exports.optionsDocs = [
    [
        'isUserId', '`boolean`', false, '`false`', 'Whether `id` is `userId` or not'
    ]
];
exports.default = (platform, ids, options) => (0, auth_1.getToken)()
    .then(platform === 'all'
    ? options && options.isUserId
        ? (0, fetch_1.default)(utils_1.getURL.BYUSERID(ids))
        : (0, fetch_1.default)(utils_1.getURL.BYPROFILEID(ids))
    : (0, fetch_1.default)(utils_1.getURL.BYIDONPLATFORM(platform, ids)))
    .then(res => res.profiles
    .map(profile => ({
    id: profile.profileId,
    userId: profile.userId,
    idOnPlatform: profile.idOnPlatform,
    platform: profile.platformType,
    username: profile.nameOnPlatform,
    avatar: (0, utils_1.getAvatars)(profile.userId)
})));
//# sourceMappingURL=findById.js.map