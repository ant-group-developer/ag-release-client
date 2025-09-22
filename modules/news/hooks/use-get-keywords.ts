import { useQuery } from '@tanstack/react-query';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';

export const useGetListKeywords = () => {
    const { data, ...res } = useQuery({
        queryKey: newsQueryKeys.getKeywords(),
        queryFn: () => newsApis.getKeywords(),
        placeholderData: (previousData) => previousData,
    });

    const keywordsData: string[] = data?.data?.data ?? [];

    return {
        keywordsData,
        ...res,
    };
};
