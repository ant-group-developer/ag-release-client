import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData, TranslationData } from '../types';

export const useGetListTranslations = (newsId: NewsData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getListTranslation(newsId),
        queryFn: () => newsApis.getListTranslations(newsId),
        placeholderData: (prev) => prev,
        enabled: !!newsId,
    });

    const translationData = data?.data?.data ?? ([] as TranslationData[]);

    return {
        translationData,
        ...res,
    };
};
