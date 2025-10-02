import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData, TranslationData } from '../types';

export const useGetOriginalTranslation = (newsId: NewsData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetailTranslation(newsId),
        queryFn: () => newsApis.getOriginalTranslation(newsId),
        placeholderData: (prev) => prev,
    });

    const translationData = data?.data?.data ?? ({} as TranslationData);

    return {
        translationData,
        ...res,
    };
};
