import { Locale } from '@/i18n/routing';
import { TENANT_TYPE, TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { TenantData } from '@/modules/tenant/types/data';
import { UserDetail } from '@/modules/user/types/data';

export interface SigninDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    locale?: Locale;
}

export interface GetTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshDto {
    refreshToken: string;
}

export interface JwtPayload {
    sub: string; // user ID
    tenantId: string; // user tenant ID
    iat: number; // issued at
    exp: number; // expiration
}

export interface SwitchTenantDto {
    tenantId: string;
}

export type UserInfoData = Pick<
    UserDetail,
    'id' | 'name' | 'avatar' | 'isActive' | 'email' | 'type'
> & {
    permission: string[];
    tenantId: TenantData['id'];
    tenantUserType: TENANT_USER_TYPE;
    tenantType: TENANT_TYPE;
};
