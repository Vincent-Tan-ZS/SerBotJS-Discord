import { Platform, UUID } from '../typings';
export interface IProgression {
    profile_id: UUID;
    level: number;
    xp: number;
    lootbox_probability: number;
}
export interface IApiResponse {
    player_profiles: IProgression[];
}
declare const _default: (platform: Platform, ids: UUID[]) => Promise<{
    id: string;
    level: number;
    xp: number;
    lootboxProbability: {
        raw: number;
        percent: string;
    };
}[]>;
export default _default;
//# sourceMappingURL=getProgression.d.ts.map