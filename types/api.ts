import { ORDER } from '@/enums/common';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';

export interface PaginationResponse<T = any> {
    data: {
        items: T[];
        metadata: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
        };
    };
    message: string;
    messagesCode?: string;
    statusCode: number;
}

export interface ListResponse<T = any> {
    status?: number;
    message?: string;
    data: Array<T>;
    total?: number;
}

export interface DetailResponse<T> {
    statusCode?: number;
    message?: string;
    messagesCode?: string;
    data: T;
}

export interface ErrorResponse {
    message: string;
}

export interface CommonUser {
    name: string;
    id: string;
}

export interface SuccessResponse {
    message: string;
    data?: string;
}

export interface CommonAttribute {
    id: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface UUIDCommonAttribute {
    dateCreated: Date;
    dateUpdated: Date | null;
    id: string;
}

export interface CommonAttributeCreator extends CommonAttribute {
    creatorId: string;
    creator: {
        id: string;
        email: string;
    };
    modifierId: string;
    modifier: {
        id: string;
        email: string;
    };
}

export interface UUIDCommonAttributeCreator extends UUIDCommonAttribute {
    creatorId: string;
    creator: {
        id: string;
        email: string;
    };
    modifierId: string;
    modifier: {
        id: string;
        email: string;
    };
}

export interface CommonFunction {
    onSuccess?: (e?: any) => void;
    onError?: (e?: any) => void;
}

export interface CommonParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
    fieldOrder?: string;
    orderBy?: ORDER;
    startCreatedAt?: string;
    endCreatedAt?: string;
    startUpdatedAt?: string;
    endUpdatedAt?: string;
}

export interface CreateFile {
    key: string;
    contentType: string; // fix -> enum
    extension: string;
    fileSizeInByte: number;
    fileName: string; // fix -> khong co khoang trong, ky tu dac biet
    googleDriveFileId?: string;
}

export interface UploadPayload {
    infoFile: {
        entityType: ENTITY_TYPE_PICTURE;
        fileName: string;
        contentType: string;
        fileSize: number;
    };
    file: File;
}

export interface CommonDataSidebar {
    id: string;
    name: string;
    count?: number;
}

export interface CreateVariables<T> extends CommonFunction {
    payload: T;
}

export interface UpdateVariables<T, K> extends CommonFunction {
    id: T;
    payload: K;
}

export interface DeleteVariables<T> extends CommonFunction {
    id: T;
}
