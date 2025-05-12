import { defaultConfig } from '@/constants/env';
import { useRouter } from '@/i18n/routing';
import { userQueryKeys } from '@/modules/user/constants';
import { ACCOUNT_TYPE } from '@/modules/user/enums';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api';
import { UserInfoData } from '../types/common';

export const defaultProfile: UserInfoData = {
    telegramId: null,
    telegramNotificationEnabled: false,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    id: '',
    name: '',
    email: '',
    avatar: null,
    phoneNumber: null,
    dateOfBirth: null,
    isActive: true,
    emailVerified: true,
    accountType: ACCOUNT_TYPE.USER,
    permanentResidence: null,
    currentAddress: null,
    taxNumber: null,
    passportNo: null,
    passportPlaceOfIssue: null,
    idNumber: null,
    idPlaceOfIssue: null,
    idDateOfIssue: null,
    contractSignedDate: null,
    contractNumber: null,
    groupId: null,
    group: null,
    permission: [],
};

export const useAuth = () => {
    const router = useRouter();

    const { data, error, refetch, isLoading } = useQuery({
        queryKey: userQueryKeys.getInfo,
        queryFn: () => authApi.getInfo(),
        // refetchOnWindowFocus: true,
    });

    const profile = data?.data?.data ?? defaultProfile;

    const isAdmin = profile.accountType === ACCOUNT_TYPE.ADMIN;
    const isUser = profile.accountType === ACCOUNT_TYPE.USER;

    const isAuthenticated = Boolean(profile.id);

    function logout() {
        const redirectUri = `${defaultConfig.REDIRECT_URI}/api/auth/sign-out`;
        const client = defaultConfig.CLIENT;
        const login = defaultConfig.LOGIN_URL;

        const url = `${login}/api/auth/sign-out?redirect_uri=${redirectUri}&client=${client}`;

        router.push(url);
    }

    return {
        permission: profile.permission,
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
