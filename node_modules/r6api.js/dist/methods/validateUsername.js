"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
exports.default = async (username) => {
    const { userId } = await (0, auth_1.getAuth)();
    return (0, auth_1.getToken)()
        .then((0, fetch_1.default)(utils_1.getURL.VALIDATEUSERNAME(userId), {
        method: 'POST',
        body: JSON.stringify({ nameOnPlatform: username })
    }))
        .then(res => res.validationReports.length > 0
        ? {
            valid: false,
            validationReports: res.validationReports.map(report => {
                const [match] = report.Message.match(/(?<=\[).*(?=\])/) || [null];
                const reportFormatted = match
                    ? match
                        .split(', ')
                        .map(x => x.split(':').flatMap(y => y.trim().split(',')))
                        .reduce((acc, cur) => {
                        acc[cur[0]] = cur[0] === 'Category' ? cur.slice(1) : cur[1];
                        return acc;
                    }, {})
                    : null;
                return {
                    message: report.Message.replace(/\[.*\]/g, '').trim(),
                    categories: reportFormatted && reportFormatted.Category || null,
                    severity: reportFormatted && reportFormatted.Severity || null,
                    locale: reportFormatted && reportFormatted.Locale || null,
                    errorCode: report.ErrorCode,
                    suggestions: typeof report.FieldValueSuggestion === 'string'
                        ? report.FieldValueSuggestion.split(',') : report.FieldValueSuggestion
                };
            })
        }
        : { valid: true });
};
//# sourceMappingURL=validateUsername.js.map