import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData, TranslationData } from '../types';

export const useGetDetailTranslation = (
    newsId: NewsData['id'],
    transId: TranslationData['id']
) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetailTranslation(newsId, transId),
        queryFn: () => newsApis.getDetailTranslation(newsId, transId),
        placeholderData: (prev) => prev,
        enabled: !!newsId || !!transId,
    });

    const translationData = data?.data?.data ?? ({} as TranslationData);

    return {
        translationData,
        ...res,
    };
};
