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

    releases: {
        canRead: true,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
    },
    tracks: {
        canRead: true,
        canCreate: false,
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
            releases: {
                canRead: checkPermission(PERMISSION.RELEASE.READ),
                canCreate: checkPermission(PERMISSION.RELEASE.CREATE),
                canUpdate: checkPermission(PERMISSION.RELEASE.UPDATE),
                canDelete: checkPermission(PERMISSION.RELEASE.DELETE),
            },
            tracks: {
                canRead: checkPermission(PERMISSION.TRACK.READ),
                canCreate: checkPermission(PERMISSION.TRACK.CREATE),
                canUpdate: checkPermission(PERMISSION.TRACK.UPDATE),
                canDelete: checkPermission(PERMISSION.TRACK.DELETE),
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
