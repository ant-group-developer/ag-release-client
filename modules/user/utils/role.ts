import { TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { USER_TYPE } from '../enums';

export const checkIsTenantAdmin = (type: TENANT_USER_TYPE): boolean => {
    return type === TENANT_USER_TYPE.ADMIN;
};

export const checkIsTenantOwner = (type: TENANT_USER_TYPE): boolean => {
    return type === TENANT_USER_TYPE.OWNER;
};

export const checkIsTenantOwnerOrAdmin = (type: TENANT_USER_TYPE): boolean => {
    const isTenantAdmin = checkIsTenantAdmin(type);
    const isTenantOwner = checkIsTenantOwner(type);
    return isTenantAdmin || isTenantOwner;
};

export const checkIsSystemAdmin = (type: USER_TYPE): boolean => {
    return type === USER_TYPE.ADMIN;
};

export const checkCanAccessTenantAll = (
    systemType: USER_TYPE,
    tenantType: TENANT_USER_TYPE
): boolean => {
    const isSystemAdmin = checkIsSystemAdmin(systemType);
    const isTenantOwnerOrAdmin = checkIsTenantOwnerOrAdmin(tenantType);
    return isSystemAdmin || isTenantOwnerOrAdmin;
};
