import { ORDER } from '@/enums/common';
import {
    CommonAttributeCreator,
    CommonFunction,
    CommonParams,
} from '@/types/api';
import { USER_ORDER_BY, USER_TYPE } from '../enums';

export interface DataFilterUser extends CommonParams {
    isActive?: 'true' | 'false';
    orderBy: ORDER;
    fieldOrder: USER_ORDER_BY;
    id?: string;
    type?: string;
}

export interface UserDetail extends CommonAttributeCreator {
    name: string | null;
    email: string;
    isActive: boolean;
    emailVerified: boolean;
    avatar: string | null;
    telegramId: string | null;
    lastLogin: string | null;
    lastIp: string | null;
    loginsCount: string | null;
    type: USER_TYPE;
}

export type UserData = Pick<
    UserDetail,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'email'
    | 'avatar'
    | 'type'
    | 'isActive'
    | 'lastLogin'
    | 'loginsCount'
    | 'creator'
    | 'modifier'
>;

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    avatar?: string;
    telegramId?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    type?: USER_TYPE;
}

export interface UpdateUser extends CommonFunction {
    payload: UpdateUserPayload;
    userId: UserData['id'];
}
export interface CreateUserPayload extends UpdateUserPayload {
    email: string;
    password: string;
}

export interface CreateUser extends CommonFunction {
    payload: CreateUserPayload;
}

export interface SyncUserData extends CommonFunction {}
