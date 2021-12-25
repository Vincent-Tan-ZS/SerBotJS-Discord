"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsDocs = void 0;
const fetch_1 = __importDefault(require("../fetch"));
const utils_1 = require("../utils");
exports.optionsDocs = [
    ['raw', '`boolean`', false, '`false`', 'Include raw API response'],
    ['locale', '`string`', false, '`\'en-gb\'`', ''],
    ['fallbackLocale', '`string`', false, '`\'en-us\'`', '']
];
exports.default = async (id, options) => {
    const raw = options && options.raw || false;
    const locale = options && options.locale || 'en-gb';
    const fallbackLocale = options && options.fallbackLocale || 'en-us';
    const res = await (0, fetch_1.default)(utils_1.getURL.NEWSBYID(id, locale, fallbackLocale), { headers: { 'Authorization': '3u0FfSBUaTSew-2NVfAOSYWevVQHWtY9q3VM8Xx9Lto' } })();
    return ({
        ...raw && { raw: res },
        total: res.total,
        tags: res.tags,
        ...res.items && {
            item: res.items.map(item => ({
                id: item.id,
                title: item.title,
                abstract: item.abstract,
                thumbnail: {
                    url: item.thumbnail.url, description: item.thumbnail.description
                },
                content: item.content,
                description: item.description,
                categories: item.categories,
                tag: item.tag,
                placement: item.placement,
                type: item.type,
                readTime: item.readTime,
                url: (0, utils_1.getNewsURL)(locale, item.type, item.button.buttonUrl),
                date: item.date
            }))
        },
        ...res.message && { message: res.message }
    });
};
//# sourceMappingURL=getNewsById.js.map