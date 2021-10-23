"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
const platforms = ['PC', 'PS4', 'XBOXONE', 'PS5', 'XBOX SERIES X'];
exports.default = () => (0, fetch_1.default)(utils_1.getURL.STATUS())()
    .then(res => res
    .filter(app => app.Name.includes('Rainbow Six Siege') && platforms.includes(app.Platform))
    .map(app => ({
    // appId: app.AppID,
    appId: app['AppID '],
    name: app.Name,
    spaceId: app.SpaceID,
    mdm: app.MDM,
    category: app.Category,
    platform: app.Platform,
    status: app.Status,
    maintenance: app.Maintenance,
    impactedFeatures: app.ImpactedFeatures
})));
//# sourceMappingURL=getStatus.js.map