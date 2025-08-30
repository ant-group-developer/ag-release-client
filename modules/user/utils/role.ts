import { SYSTEM_TENANT_ID } from '@/modules/tenant/constants';
import { TENANT_TYPE, TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { USER_TYPE } from '../enums';
import { UserDetail } from '../types/data';

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
    tenantUserType: TENANT_USER_TYPE
): boolean => {
    const isSystemAdmin = checkIsSystemAdmin(systemType);
    const isTenantOwnerOrAdmin = checkIsTenantOwnerOrAdmin(tenantUserType);
    return isSystemAdmin || isTenantOwnerOrAdmin;
};

export const checkIsSystemTenant = (tenantId: string) =>
    tenantId === SYSTEM_TENANT_ID;

export const getTenantUserType = (
    data: UserDetail['tenantUser'] = [],
    tenantId: string
) => {
    return data.find((item) => item.tenant.id === tenantId)?.type;
};

export const checkTenantType = (type: TENANT_TYPE) => {
    return {
        isTypeLabel: type === TENANT_TYPE.LABEL,
        isTypeWhiteLabel: type === TENANT_TYPE.WHITE_LABEL,
    };
};
