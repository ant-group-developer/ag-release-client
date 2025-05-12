import { QUERY_KEY } from '@/constants/query-key';

export const permissionQueryKeys = {
    all: [QUERY_KEY.PERMISSION.KEY],
    getUserPermission: [
        QUERY_KEY.PERMISSION.KEY,
        QUERY_KEY.PERMISSION.GET_USER_PERMISSION,
    ],
    getGroupPermission: [
        QUERY_KEY.PERMISSION.KEY,
        QUERY_KEY.PERMISSION.GET_GROUP_PERMISSION,
    ],
};

export enum PERMISSION_BASE_ON {
    GROUP = 'group',
    USER = 'user',
}
