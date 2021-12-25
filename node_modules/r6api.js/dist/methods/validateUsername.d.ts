declare const _default: (username: string) => Promise<{
    valid: boolean;
    validationReports: {
        message: string;
        categories: string[] | null;
        severity: string | null;
        locale: string | null;
        errorCode: number;
        suggestions: string[] | null;
    }[];
} | {
    valid: boolean;
    validationReports?: undefined;
}>;
export default _default;
//# sourceMappingURL=validateUsername.d.ts.map