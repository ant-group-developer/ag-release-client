import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { TENANT_TYPE, TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { userQueryKeys } from '@/modules/user/constants';
import { USER_TYPE } from '@/modules/user/enums';
import {
    checkCanAccessTenantAll,
    checkIsSystemAdmin,
    checkIsSystemTenant,
    checkIsTenantOwner,
    checkIsTenantOwnerOrAdmin,
} from '@/modules/user/utils/role';
import { useQuery } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { authApi } from '../api';
import { UserInfoData } from '../types/auth';

export const defaultProfile: UserInfoData = {
    id: '',
    name: 'N/A',
    email: 'N/A',
    avatar: getAvatarUrl('unknown'),
    permission: [],
    isActive: false,
    type: USER_TYPE.USER,
    tenantId: '',
    tenantType: TENANT_TYPE.LABEL,
    tenantUserType: TENANT_USER_TYPE.MEMBER,
};

export const useAuth = () => {
    const { data, ...rest } = useQuery({
        queryKey: userQueryKeys.info(),
        queryFn: () => authApi.getInfo(),
        refetchOnWindowFocus: true,
    });

    const profile = data?.data?.data ?? defaultProfile;

    const isAdmin = checkIsSystemAdmin(profile.type);
    const isUser = !isAdmin;
    const isTenantOwner = checkIsTenantOwner(profile.tenantUserType);
    const isTenantOwnerOrAdmin = checkIsTenantOwnerOrAdmin(
        profile.tenantUserType
    );
    const canAccessTenantAll = checkCanAccessTenantAll(
        profile.type,
        profile.tenantUserType
    );
    const isSystemTenant = checkIsSystemTenant(profile.tenantId) && isAdmin;

    const isAuthenticated = Boolean(profile.id);

    function logout() {
        signOut();
    }

    return {
        ...rest,
        permission: profile.permission || [],
        profile,
        isAuthenticated,
        isAdmin,
        isUser,
        isTenantOwner,
        isTenantOwnerOrAdmin,
        canAccessTenantAll,
        isSystemTenant,
        isNotSystemTenant: !isSystemTenant,
        logout,
    };
};
