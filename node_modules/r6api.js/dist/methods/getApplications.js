"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
const constants_1 = require("../constants");
exports.default = (applicationIds) => (0, auth_1.getToken)()
    .then((0, fetch_1.default)(utils_1.getURL.APPLICATIONS(applicationIds)))
    .then(res => res.applications)
    .then(res => res.map(application => {
    var _a;
    return ({
        id: application.applicationId,
        name: ((_a = constants_1.APPLICATIONS
            .find(app => app.id === application.applicationId)) === null || _a === void 0 ? void 0 : _a.name) || application.name,
        platform: application.platform,
        spaceId: application.spaceId
    });
}));
//# sourceMappingURL=getApplications.js.map