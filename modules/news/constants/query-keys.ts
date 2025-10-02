import { QUERY_KEY } from '@/constants/query-key';
import { NewsData, NewsDataFilter } from '../types';

export const newsQueryKeys = {
    all: [QUERY_KEY.NEWS.KEY] as const,
    lists: () => [...newsQueryKeys.all, QUERY_KEY.NEWS.GET_LIST] as const,
    list: (params?: NewsDataFilter) =>
        params
            ? ([...newsQueryKeys.lists(), params] as const)
            : newsQueryKeys.lists(),
    getKeywords: () => [...newsQueryKeys.all, 'keywords'],
    getDetail: (locale: string, slug: NewsData['slug']) => [
        newsQueryKeys.all,
        locale,
        slug,
    ],
    getDetailTranslation: (translationId: string) => [
        newsQueryKeys.all,
        QUERY_KEY.NEWS.GET_DETAIL_TRANSLATION,
        translationId,
    ],
    getListTranslation: (newsId: string) => [
        newsQueryKeys.all,
        QUERY_KEY.NEWS.GET_LIST_TRANSLATIONS,
        newsId,
    ],
    updates: () => [...newsQueryKeys.all, QUERY_KEY.NEWS.UPDATE] as const,
};
