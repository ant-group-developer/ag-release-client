import { UserDetail } from '@/modules/user/types/data';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    refresh_token: string;
}

export interface SignupPayload {
    firstname: string;
    lastname: string;
    email: string;
    birthday: string;
    departmentId: number;
    password: string;
    confirmPassword: string;
    contractNumber: string | undefined;
    contract_date: string | undefined;
    address: string | undefined;
    phone: string | undefined;
    PIN: string | undefined;
    PIN_address: string | undefined;
    PIN_date: string | undefined;
    tax_number: string | undefined;
}

export interface RequestResetPasswordParams {
    email: string;
}

export interface ResetPasswordPayload {
    password: string;
    token: string;
}

export interface ResendVerifyEmail {
    email: string;
}

export interface UserInfoData extends UserDetail {
    permission: string[];
}

export * from './token';
