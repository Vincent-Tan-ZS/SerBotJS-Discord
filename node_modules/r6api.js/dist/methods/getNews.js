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
    [
        'category', '`string`', false, '`\'all\'`',
        '`\'all\'`, `\'game-updates\'`, `\'patch-notes\'`, `\'community\'`, `\'store\'`, `\'esports\'`'
    ],
    ['media', '`string`', false, '`\'all\'`', '`\'all\'`, `\'news\'`, `\'videos\'`'],
    ['placement', '`string`', false, '`\'\'`', 'Ex: `\'featured-news-article\'`'],
    ['limit', '`number`', false, '`6`', ''],
    ['skip', '`number`', false, '`0`', ''],
    ['startIndex', '`number`', false, '`0`', ''],
    ['locale', '`string`', false, '`\'en-gb\'`', ''],
    ['fallbackLocale', '`string`', false, '`\'en-us\'`', '']
];
exports.default = async (options) => {
    const raw = options && options.raw || false;
    const category = options && options.category || 'all';
    const media = options && options.media || 'all';
    const placement = options && options.placement || '';
    const limit = options && options.limit || 6;
    const skip = options && options.skip || 0;
    const startIndex = options && options.startIndex || 0;
    const locale = options && options.locale || 'en-gb';
    const fallbackLocale = options && options.fallbackLocale || 'en-us';
    const res = await (0, fetch_1.default)(utils_1.getURL.NEWS(category, media, placement, locale, fallbackLocale, limit, skip, startIndex), { headers: { 'Authorization': '3u0FfSBUaTSew-2NVfAOSYWevVQHWtY9q3VM8Xx9Lto' } })();
    return ({
        ...raw && { raw: res },
        total: res.total,
        limit: res.limit,
        categories: res.categoriesFilter,
        media: res.mediaFilter,
        skip: res.skip,
        startIndex: res.startIndex,
        placement: res.placementFilter,
        tags: res.tags,
        items: res.items.map(item => ({
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
    });
};
//# sourceMappingURL=getNews.js.map