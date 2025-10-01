import { NewsCategoryData } from '@/modules/news-category/types';
import { UserData } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';
import { NEWS_STATUS } from '../enums';

export interface NewsData extends CommonAttribute {
    creatorId: string;
    creator: UserData;
    modifierId: string;
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    status: NEWS_STATUS;
    newsCategory: NewsCategoryData;
    newsCategoryId: string;
    slug: string;
    keywords: string[];
    languageCode: string;
    languageName: string;
}

export interface NewsDataFilter extends CommonParams {
    status?: string;
    keywords?: string;
    newsCategoryId?: string;
    languageCode?: string;
}

export interface TranslationData extends CommonAttribute {
    title: string;
    description: string;
    content: string;
    languageCode: string;
    languageName: string;
    creator: UserData;
    creatorId: string;
}
