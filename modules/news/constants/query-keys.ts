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
    getDetail: (slug: NewsData['slug']) => [newsQueryKeys.all, slug],
    getDetailTranslation: (newsId: string, translationId: string) => [
        newsQueryKeys.getDetail,
        { newsId, translationId },
    ],
};
