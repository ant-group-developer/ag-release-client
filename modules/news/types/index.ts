import { NewsCategoryData } from '@/modules/news-category/types';
import { CommonAttribute, CommonParams } from '@/types/api';
import { NEWS_STATUS } from '../enums';

export interface NewsData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    titleVi: string;
    titleEn: string;
    descriptionVi: string;
    descriptionEn: string;
    contentVi: string;
    contentEn: string;
    thumbnail: string;
    status: NEWS_STATUS;
    newsCategory: NewsCategoryData;
    newsCategoryId: string;
    slug: string;
    keywords: string[];
}

export interface NewsDataFilter extends CommonParams {
    status?: string;
    keywords?: string;
    newsCategoryId?: string;
}
