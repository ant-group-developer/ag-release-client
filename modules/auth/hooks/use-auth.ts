import { APP_ROUTES } from '@/enums/routes';
import { userQueryKeys } from '@/modules/user/constants';
import { USER_TYPE } from '@/modules/user/enums';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
    type: USER_TYPE.USER,
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
        queryKey: userQueryKeys.info(),
        queryFn: () => authApi.getInfo(),
        refetchOnWindowFocus: true,
    });

    const profile = data?.data?.data ?? defaultProfile;

    const isAdmin = profile.type === USER_TYPE.ADMIN;
    const isUser = profile.type === USER_TYPE.USER;

    const isAuthenticated = Boolean(profile.id);

    function logout() {
        router.push(APP_ROUTES.LOGOUT);
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
