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
    topic: {
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
    topicSetting: {
        canRead: boolean;
        canUpdate: boolean;
    };
    approverSetting: {
        canRead: boolean;
        canUpdate: boolean;
    };
    order: {
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
        canReview: boolean;
    };
    product: {
        canRead: boolean;
        canUploadFile: boolean;
        canManage: boolean;
    };
    productType: {
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
    priority: {
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
}
