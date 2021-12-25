"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
exports.default = (url, params) => (0, auth_1.getToken)().then((0, fetch_1.default)(url, params));
//# sourceMappingURL=custom.js.map