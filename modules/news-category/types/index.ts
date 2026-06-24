import { CommonAttribute, CommonParams } from '@/types/api';

export interface NewsCategoryData extends CommonAttribute {
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
    order: number;
    parentId?: string;
    children?: NewsCategoryData[];
}

export interface NewsCategoryDataFilter extends CommonParams {}
