import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { userQueryKeys } from '@/modules/user/constants';
import { USER_TYPE } from '@/modules/user/enums';
import { useQuery } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { authApi } from '../api';
import { UserInfoData } from '../types/common';

export const defaultProfile: UserInfoData = {
    telegramId: null,
    id: '',
    name: 'User',
    email: 'user@ant-group.net',
    avatar: getAvatarUrl('user@ant-group.net'),
    permission: [],
    isActive: false,
    emailVerified: false,
    lastLogin: null,
    lastIp: null,
    loginsCount: null,
    type: USER_TYPE.USER,
    creatorId: '',
    creator: {
        id: '',
        email: '',
    },
    modifierId: '',
    modifier: {
        id: '',
        email: '',
    },
    createdAt: '',
    updatedAt: null,
};

export const useAuth = () => {
    const { data, error, refetch, isLoading } = useQuery({
        queryKey: userQueryKeys.info(),
        queryFn: () => authApi.getInfo(),
        refetchOnWindowFocus: true,
    });

    const profile = data?.data?.data ?? defaultProfile;

    const isAdmin = profile.type === USER_TYPE.ADMIN;
    const isUser = profile.type === USER_TYPE.USER;

    const isAuthenticated = Boolean(profile.id);

    function logout() {
        signOut();
    }

    return {
        permission: profile.permission || [],
        profile,
        error,
        isAuthenticated,
        isLoading,
        isAdmin,
        isUser,
        logout,
        refreshProfile: refetch,
    };
};
