import { UUID } from '../typings';
export interface IApplications {
    applicationId: UUID;
    name: string;
    platform: string;
    spaceId: UUID;
    overrideResponse: null;
}
export interface IApiResponse {
    applications: IApplications[];
}
declare const _default: (applicationIds: UUID[]) => Promise<{
    id: string;
    name: string;
    platform: string;
    spaceId: string;
}[]>;
export default _default;
//# sourceMappingURL=getApplications.d.ts.map