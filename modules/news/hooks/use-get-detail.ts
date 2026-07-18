import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData } from '../types';

const EMPTY_NEWS_DATA = {} as NewsData;

export const useGetDetailNews = (locale: string, slug: NewsData['slug']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetail(locale, slug),
        queryFn: () => newsApis.getDetailBySlug(locale, slug),
        placeholderData: (prev) => prev,
        enabled: !!slug,
    });

    const newsData = data?.data?.data ?? EMPTY_NEWS_DATA;

    return {
        newsData,
        ...res,
    };
};
