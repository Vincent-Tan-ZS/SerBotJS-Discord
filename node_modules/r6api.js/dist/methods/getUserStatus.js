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
exports.default = (ids, options) => {
    return (0, auth_1.getToken)()
        .then((0, fetch_1.default)(utils_1.getURL.ONLINESTATUS(ids), { headers: { 'Ubi-LocaleCode': 'x' } }))
        .then(res => res.onlineStatuses)
        .then(async (res) => {
        const applicationIds = [...new Set(res
                .map(r => r.connections.map(connection => connection.applicationId))
                .flat())];
        const applications = options && options.fetchApplications && applicationIds.length
            ? await (0, getApplications_1.default)(applicationIds)
            : constants_1.APPLICATIONS;
        return res.map(r => ({
            userId: r.userId,
            status: r.onlineStatus,
            applications: r.connections.map(connection => {
                const application = applications
                    .find(app => app.id === connection.applicationId);
                return {
                    id: connection.applicationId,
                    name: (application === null || application === void 0 ? void 0 : application.name) || null,
                    platform: (application === null || application === void 0 ? void 0 : application.platform) || null,
                    profileId: connection.connectionProfileId,
                    createdAt: connection.createdAt,
                    lastModifiedAt: connection.lastModifiedAt
                };
            }),
            manuallySet: r.manuallySet || null
        }));
    });
};
//# sourceMappingURL=getUserStatus.js.map