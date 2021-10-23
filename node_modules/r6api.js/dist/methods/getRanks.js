"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsDocs = void 0;
const auth_1 = require("../auth");
const fetch_1 = __importDefault(require("../fetch"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.optionsDocs = [
    [
        'seasonIds', '`number \\| number[] \\| string`', false,
        '`-1`',
        `Numbers from \`6\` to \`${Object.keys(constants_1.SEASONS).slice(-1)[0]}\` or \`-1\` or \`'all'\``
    ],
    [
        'regionIds', '`string \\| string[]`', false,
        '`[\'emea\', \'ncsa\', \'apac\']`',
        '`\'emea\'`, `\'ncsa\'`, `\'apac\'` or `\'all\'`'
    ],
    [
        'boardIds', '`string \\| string[]`', false,
        '`[\'pvp_ranked\', \'pvp_casual\', \'pvp_newcomer\', \'pvp_event\']`',
        '`\'pvp_ranked\'`, `\'pvp_casual\'`, `\'pvp_newcomer\'` or `\'pvp_event\'`'
    ]
];
const getMatchResult = (id) => ({ 0: 'unknown', 1: 'win', 2: 'loss', 3: 'abandon' }[id]);
exports.default = (platform, ids, options) => {
    var _a;
    const boardIds = options && options.boardIds && options.boardIds !== 'all'
        ? [options.boardIds].flat() : Object.keys(constants_1.BOARDS);
    const minSeasonId = (_a = Object.entries(constants_1.BOARDS)
        .reverse().filter(([boardId]) => boardIds.includes(boardId))[0]) === null || _a === void 0 ? void 0 : _a[1].seasonId;
    const seasonIds = options && (options.seasonIds === 'all'
        ? Object.keys(constants_1.SEASONS)
            .slice(minSeasonId - Number(Object.keys(constants_1.SEASONS)[0]))
            .map(season => Number(season))
        : options.seasonIds && [options.seasonIds].flat()) || [-1];
    const regionIds = options && options.regionIds && options.regionIds !== 'all'
        ? [options.regionIds].flat() : Object.keys(constants_1.REGIONS);
    return Promise.all(seasonIds.map(seasonId => Promise.all(regionIds.map(regionId => Promise.all(boardIds.map(boardId => (0, auth_1.getToken)()
        .then((0, fetch_1.default)(utils_1.getURL.RANKS(platform, ids, seasonId, regionId, boardId)))))))))
        .then(res => Object.values(res
        .flat(2)
        .reduce((acc, { players }) => {
        Object.entries(players)
            .map(([id, { season: seasonId, region: regionId, board_id: boardId, ...val }]) => {
            const matches = val.wins + val.losses;
            const currentRankId = boardId !== 'pvp_ranked'
                ? (0, utils_1.getRankIdFromMmr)(seasonId, val.mmr, matches) : val.rank;
            acc[id] = acc[id] || { id: id, seasons: {} };
            acc[id].seasons[seasonId] = acc[id].seasons[seasonId] || {
                seasonId,
                ...constants_1.SEASONS[seasonId] && {
                    seasonName: constants_1.SEASONS[seasonId].name,
                    seasonColor: constants_1.SEASONS[seasonId].color,
                    seasonImage: (0, utils_1.getCDNURL)(constants_1.SEASONS[seasonId].imageId, 'jpg'),
                    seasonReleaseDate: constants_1.SEASONS[seasonId].releaseDate
                },
                regions: {}
            };
            acc[id].seasons[seasonId].regions[regionId] =
                acc[id].seasons[seasonId].regions[regionId] || {
                    regionId,
                    regionName: constants_1.REGIONS[regionId],
                    boards: {}
                };
            acc[id].seasons[seasonId].regions[regionId].boards[boardId] = {
                boardId,
                boardName: constants_1.BOARDS[boardId].name,
                skillMean: val.skill_mean,
                skillStdev: val.skill_stdev,
                current: {
                    id: currentRankId,
                    name: (0, utils_1.getRankNameFromRankId)(currentRankId, seasonId),
                    mmr: val.mmr,
                    icon: (0, utils_1.getRankIconFromRankId)(currentRankId, seasonId)
                },
                max: {
                    id: val.max_rank,
                    name: (0, utils_1.getRankNameFromRankId)(val.max_rank, seasonId),
                    mmr: val.max_mmr,
                    icon: (0, utils_1.getRankIconFromRankId)(val.max_rank, seasonId)
                },
                lastMatch: {
                    result: getMatchResult(val.last_match_result),
                    mmrChange: val.last_match_mmr_change,
                    skillMeanChange: val.last_match_skill_mean_change,
                    skillStdevChange: val.last_match_skill_stdev_change
                },
                pastSeasons: {
                    wins: val.past_seasons_wins,
                    losses: val.past_seasons_losses,
                    winRate: (0, utils_1.getWinRate)({
                        wins: val.past_seasons_wins, losses: val.past_seasons_losses
                    }),
                    matches: val.past_seasons_wins + val.past_seasons_losses,
                    abandons: val.past_seasons_abandons
                },
                previousMmr: val.previous_rank_mmr,
                nextMmr: val.next_rank_mmr,
                topRankPosition: val.top_rank_position,
                kills: val.kills,
                deaths: val.deaths,
                kd: (0, utils_1.getKD)(val),
                wins: val.wins,
                losses: val.losses,
                winRate: (0, utils_1.getWinRate)(val),
                matches,
                abandons: val.abandons,
                updateTime: val.update_time
            };
        });
        return acc;
    }, {})));
};
//# sourceMappingURL=getRanks.js.map