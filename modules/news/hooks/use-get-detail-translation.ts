import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { TranslationData } from '../types';

export const useGetDetailTranslation = (transId: TranslationData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getDetailTranslation(transId),
        queryFn: () => newsApis.getDetailTranslation(transId),
        placeholderData: (prev) => prev,
        enabled: !!transId,
    });

    const translationData = data?.data?.data ?? ({} as TranslationData);

    return {
        translationData,
        ...res,
    };
};
