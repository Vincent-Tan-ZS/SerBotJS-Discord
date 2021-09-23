import { UUID } from '../typings';
declare const platforms: readonly ["PC", "PS4", "XBOXONE", "PS5", "XBOX SERIES X"];
export interface IApiResponse {
    'AppID ': UUID;
    MDM: string;
    SpaceID: UUID;
    Category: 'Instance';
    Name: string;
    Platform: typeof platforms[number];
    Status: 'Online' | 'Interrupted' | 'Degraded' | 'Maintenance';
    Maintenance: null | boolean;
    ImpactedFeatures: string[];
}
declare const _default: () => Promise<{
    appId: string;
    name: string;
    spaceId: string;
    mdm: string;
    category: "Instance";
    platform: "PC" | "PS5" | "PS4" | "XBOXONE" | "XBOX SERIES X";
    status: "Online" | "Interrupted" | "Degraded" | "Maintenance";
    maintenance: boolean | null;
    impactedFeatures: string[];
}[]>;
export default _default;
//# sourceMappingURL=getStatus.d.ts.map