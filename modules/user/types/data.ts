import { GroupData } from '@/modules/group/types/data';
import { CommonAttribute, CommonFunction, CommonParams } from '@/types/api';
import { ACCOUNT_TYPE, SEX } from '../enums';

export interface RoleData extends CommonAttribute {
    name: string;
}

export interface DepartmentData {
    id: number;
    name: string;
}

export interface UserDetailData {
    dateCreated: Date;
    dateUpdated: Date;
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    groups: GroupData[];
    isActive: boolean;
    emailVerified: boolean;
    accountType: ACCOUNT_TYPE;
    sex: SEX | null;
    title: string | null;
    titleEn: string | null;
    permanentResidence: string | null;
    permanentResidenceEn: string | null;
    currentAddress: string | null;
    currentAddressEn: string | null;
    taxNumber: string | null;
    passportNo: string | null;
    passportPlaceOfIssue: string | null;
    passportPlaceOfIssueEn: string | null;
    idNumber: string | null;
    idPlaceOfIssue: string | null;
    idPlaceOfIssueEn: string | null;
    idDateOfIssue: Date | null;
    contractSignedDate: Date | null;
    contractNumber: string | null;
    telegramId: string;
    telegramNotificationEnabled: boolean;
}

export type UserData = Pick<
    UserDetailData,
    'id' | 'email' | 'name' | 'accountType' | 'groups'
>;

export interface UpdateUserPayload {
    name: string;
    phoneNumber: string | null;
    dateOfBirth: Date | string | null;
    telegramId: string | null;
    telegramNotificationEnabled: boolean | null;
}
export interface UpdateUser extends CommonFunction {
    payload: UpdateUserPayload;
}

export interface DataFilterUser extends CommonParams {}
