import { PERMISSION } from '@/modules/auth/constants/permission';
import { UserInfoData } from '@/modules/auth/types/common';
import { Permission } from '@/modules/auth/types/permission';
import { create } from 'zustand';

type SetPermission = (
    data: UserInfoData['permission'],
    isAdmin: boolean
) => void;

export interface PermissionState {
    permission: Permission;
    setPermission: SetPermission;
}

const defaultPermission: Permission = {
    log: {
        canRead: true,
    },
    setting: {
        canRead: true,
        canUpdate: false,
    },
    permission: {
        canUpdate: false,
    },
    topic: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
    },
    topicSetting: {
        canRead: true,
        canUpdate: false,
    },
    approverSetting: {
        canRead: true,
        canUpdate: false,
    },
    order: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        canReview: false,
    },
    product: {
        canRead: true,
        canUploadFile: false,
        canManage: false,
    },
    productType: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
    },
    priority: {
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
    },
};

const usePermissionStore = create<PermissionState>((set) => {
    const setPermission: SetPermission = (data, isAdmin) => {
        const checkPermission = (name: string) => {
            if (isAdmin) return true;
            return data.includes(name);
        };

        const permission: Permission = {
            log: {
                canRead: checkPermission(PERMISSION.LOG.READ),
            },
            setting: {
                canRead: checkPermission(PERMISSION.SETTING.READ),
                canUpdate: checkPermission(PERMISSION.SETTING.UPDATE),
            },
            permission: {
                canUpdate: checkPermission(PERMISSION.PERMISSION.UPDATE),
            },
            topic: {
                canCreate: checkPermission(PERMISSION.TOPIC.CREATE),
                canRead: checkPermission(PERMISSION.TOPIC.READ),
                canUpdate: checkPermission(PERMISSION.TOPIC.UPDATE),
                canDelete: checkPermission(PERMISSION.TOPIC.DELETE),
            },
            topicSetting: {
                canRead: checkPermission(PERMISSION.TOPIC_SETTING.READ),
                canUpdate: checkPermission(PERMISSION.TOPIC_SETTING.UPDATE),
            },
            order: {
                canCreate: checkPermission(PERMISSION.ORDER.CREATE),
                canRead: checkPermission(PERMISSION.ORDER.READ),
                canUpdate: checkPermission(PERMISSION.ORDER.UPDATE),
                canReview: checkPermission(PERMISSION.ORDER.REVIEW),
                canDelete: checkPermission(PERMISSION.ORDER.DELETE),
            },
            product: {
                canRead: checkPermission(PERMISSION.PRODUCT.READ),
                canManage: checkPermission(PERMISSION.PRODUCT.MANAGE),
                canUploadFile: checkPermission(PERMISSION.PRODUCT.UPLOAD_FILE),
            },
            productType: {
                canCreate: checkPermission(PERMISSION.PRODUCT_TYPE.CREATE),
                canRead: checkPermission(PERMISSION.PRODUCT_TYPE.READ),
                canUpdate: checkPermission(PERMISSION.PRODUCT_TYPE.UPDATE),
                canDelete: checkPermission(PERMISSION.PRODUCT_TYPE.DELETE),
            },
            priority: {
                canCreate: checkPermission(PERMISSION.PRIORITY.CREATE),
                canRead: checkPermission(PERMISSION.PRIORITY.READ),
                canUpdate: checkPermission(PERMISSION.PRIORITY.UPDATE),
                canDelete: checkPermission(PERMISSION.PRIORITY.DELETE),
            },
            approverSetting: {
                canRead: checkPermission(PERMISSION.APPROVER_SETTING.READ),
                canUpdate: checkPermission(PERMISSION.APPROVER_SETTING.UPDATE),
            },
        };

        set({
            permission,
        });
    };

    return {
        permission: defaultPermission,
        setPermission,
    };
});

export default usePermissionStore;
