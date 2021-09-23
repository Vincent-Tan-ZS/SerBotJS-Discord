import { PlatformAll, UUID } from '../typings';
export interface IProfile {
    profileId: UUID;
    userId: UUID;
    idOnPlatform: UUID | string;
    platformType: PlatformAll;
    nameOnPlatform: string;
}
export interface IApiResponse {
    profiles: IProfile[];
}
declare const _default: (platform: PlatformAll, username: string[]) => Promise<{
    id: string;
    userId: string;
    idOnPlatform: string;
    platform: "uplay" | "psn" | "xbl" | "steam" | "epic" | "amazon";
    username: string;
    avatar: {
        146: string;
        256: string;
        500: string;
    };
}[]>;
export default _default;
//# sourceMappingURL=findByUsername.d.ts.map