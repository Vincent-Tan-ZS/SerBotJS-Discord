import { Platform, UUID } from './typings';
export interface IUbiAuth {
    platformType: Platform;
    ticket: string;
    twoFactorAuthenticationTicket: string | null;
    profileId: UUID;
    userId: UUID;
    nameOnPlatform: string;
    environment: string;
    expiration: string;
    spaceId: UUID;
    clientIp: string;
    clientIpCountry: string;
    serverTime: string;
    sessionId: UUID;
    sessionKey: string;
    rememberMeTicket: string;
}
export declare let ubiAppId: string;
export declare const login: () => Promise<IUbiAuth>;
export declare const getAuth: () => Promise<IUbiAuth>;
export declare const getTicket: () => Promise<string>;
export declare const getToken: () => Promise<string>;
export declare const setCredentials: (email: string, password: string) => void;
export declare const setUbiAppId: (_ubiAppId: string) => void;
export declare const setAuthFileDirPath: (path: string) => void;
export declare const setAuthFileName: (name: string) => void;
export declare const setAuthFilePath: (path: string) => void;
export declare const getAuthFilePath: () => string;
//# sourceMappingURL=auth.d.ts.map