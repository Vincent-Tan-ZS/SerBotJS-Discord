import * as constants from './constants';
export declare type UUID = string;
export declare type Platform = typeof constants.PLATFORMS[number];
export declare type PlatformAll = typeof constants.PLATFORMSALL[number];
export declare type PlatformAllExtended = PlatformAll | 'all';
export declare type RegionId = keyof typeof constants.REGIONS;
export declare type SeasonId = keyof typeof constants.SEASONS;
export declare type SeasonIdExtended = SeasonId | -1;
export declare type OldSeasonId = keyof typeof constants.OLD_SEASONS;
/** ? Dust Line (2) - Skull Rain (3) */
export declare type RankIdV1 = typeof constants.RANKS_V1[number]['id'];
/** Red Crow (4) */
export declare type RankIdV2 = typeof constants.RANKS_V2[number]['id'];
/** Velvet Shell (5) - Phantom Sight (14) */
export declare type RankIdV3 = typeof constants.RANKS_V3[number]['id'];
/** Ember Rise (15) - North Star (22) */
export declare type RankIdV4 = typeof constants.RANKS_V4[number]['id'];
/** Crystal Guard (23) - latest */
export declare type RankIdV5 = typeof constants.RANKS_V5[number]['id'];
export declare type OperatorName = keyof typeof constants.OPERATORS;
export declare type WeaponTypeIndex = keyof typeof constants.WEAPONTYPES;
export declare type WeaponTypeId = typeof constants.WEAPONTYPES[WeaponTypeIndex]['id'];
export declare type WeaponName = keyof typeof constants.WEAPONS;
export declare type MPType = 'pvp' | 'pve';
export declare type BoardId = keyof typeof constants.BOARDS;
export declare type StatsCategoryName = keyof typeof constants.STATS_CATEGORIES;
export declare type IOptionsDocs = [
    Param: string,
    Type: string,
    Required: boolean,
    Default: string,
    Description: string
][];
//# sourceMappingURL=typings.d.ts.map