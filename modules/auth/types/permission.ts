export interface Permission {
    log: {
        canRead: boolean;
    };
    setting: {
        canRead: boolean;
        canUpdate: boolean;
    };
    permission: {
        canUpdate: boolean;
    };
    releases: {
        canRead: boolean;
        canCreate: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
}
