import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData } from '../types';

export const useGetDetailNews = (locale: string, slug: NewsData['slug']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetail(locale, slug),
        queryFn: () => newsApis.getDetailBySlug(locale, slug),
        placeholderData: (prev) => prev,
    });

    const newsData = data?.data?.data ?? ({} as NewsData);

    return {
        newsData,
        ...res,
    };
};
