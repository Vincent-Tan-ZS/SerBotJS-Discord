"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsDocs = void 0;
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const getApplications_1 = __importDefault(require("./getApplications"));
const utils_1 = require("../utils");
const constants_1 = require("../constants");
exports.optionsDocs = [
    [
        'fetchApplications', '`boolean`', false, '`false`',
        'Make another API request to get additional information about applications'
    ]
];
exports.default = (ids, options) => (0, auth_1.getToken)()
    .then((0, fetch_1.default)(utils_1.getURL.PROFILEAPPLICATIONS(ids)))
    .then(res => res.applications)
    .then(async (res) => {
    const applicationIds = [...new Set(res.map(application => application.appId))];
    const applications = options && options.fetchApplications && applicationIds.length
        ? await (0, getApplications_1.default)(applicationIds)
        : constants_1.APPLICATIONS;
    return Object.entries((0, utils_1.groupBy)(res.map(application => {
        var _a, _b;
        return ({
            id: application.appId,
            name: ((_a = applications.find(app => app.id === application.appId)) === null || _a === void 0 ? void 0 : _a.name) || null,
            platform: ((_b = applications.find(app => app.id === application.appId)) === null || _b === void 0 ? void 0 : _b.platform) || null,
            profileId: application.profileId,
            sessionsPlayed: application.sessionsPlayed,
            daysPlayed: application.daysPlayed,
            lastPlayedAt: application.lastDatePlayed,
            firstPlayedAt: application.firstDatePlayed
        });
    }), 'profileId', true)).map(([id, apps]) => ({ id, applications: apps }));
});
//# sourceMappingURL=getProfileApplications.js.map