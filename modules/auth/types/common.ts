import { ACCOUNT_TYPE } from '@/modules/user/enums';

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

export interface UserInfoData {
    dateCreated: Date;
    dateUpdated: Date;
    telegramId: string | null;
    telegramNotificationEnabled: boolean;
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    isActive: boolean;
    emailVerified: boolean;
    accountType: ACCOUNT_TYPE;
    permanentResidence: string | null;
    currentAddress: string | null;
    taxNumber: string | null;
    passportNo: string | null;
    passportPlaceOfIssue: string | null;
    idNumber: string | null;
    idPlaceOfIssue: string | null;
    idDateOfIssue: string | null;
    contractSignedDate: string | null;
    contractNumber: string | null;
    groupId: number | null;
    group: {
        id: number;
        name: string;
    } | null;
    permission: string[];
}

export * from './token';
