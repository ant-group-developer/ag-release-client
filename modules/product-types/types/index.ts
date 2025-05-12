import { ACCEPT_FILE, FIELD_TYPE } from '@/enums/common';

export interface ProductCountData
    extends Pick<ProductTypeData, 'id' | 'nameVi' | 'nameEn'> {
    count: number;
}

export interface ProductTypeData {
    id: string;
    code: string;
    nameVi: string;
    nameEn: string;
    order: number;
    note?: string;
    color: string;
    fieldType: FIELD_TYPE;
    acceptFile: ACCEPT_FILE;
    dateCreated: string;
    dateUpdated: string;
    productCount: number;
    isThumbailable: boolean;
    googleDriveIconId: string | null | undefined;
}
