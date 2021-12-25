import { UUID, IOptionsDocs } from '../typings';
export interface IConnections {
    applicationId: UUID;
    connectionProfileId: UUID;
    createdAt: string;
    lastModifiedAt: string;
    stagingSpaceId: string;
}
export declare type OnlineStatus = 'online' | 'away' | 'dnd' | 'offline';
export interface IOnlineStatuses {
    connections: IConnections[];
    manuallySet?: boolean;
    onlineStatus: OnlineStatus;
    userId: UUID;
}
export interface IApiResponse {
    onlineStatuses: IOnlineStatuses[];
}
export interface IOptions {
    fetchApplications: boolean;
}
export declare const optionsDocs: IOptionsDocs;
declare const _default: (ids: UUID[] | string[], options: IOptions) => Promise<{
    userId: string;
    status: OnlineStatus;
    applications: {
        id: string;
        name: string | null;
        platform: string | null;
        profileId: string;
        createdAt: string;
        lastModifiedAt: string;
    }[];
    manuallySet: true | null;
}[]>;
export default _default;
//# sourceMappingURL=getUserStatus.d.ts.map