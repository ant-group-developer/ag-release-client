import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData } from '../types';

export const useGetListNewsWithTranslate = (newsId: NewsData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetail(newsId),
        queryFn: () => newsApis.getListNewsWithTranslate(newsId),
        placeholderData: (prev) => prev,
        enabled: !!newsId,
    });

    const newsData = data?.data?.data ?? ([] as NewsData[]);

    return {
        newsData,
        ...res,
    };
};
