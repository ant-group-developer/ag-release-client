import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData } from '../types';

export const useGetDetailNews = (slug: NewsData['slug']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetail(slug),
        queryFn: () => newsApis.getDetailBySlug(slug),
        placeholderData: (prev) => prev,
    });

    const newsData = data?.data?.data ?? ({} as NewsData);

    return {
        newsData,
        ...res,
    };
};
