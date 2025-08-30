import { useQuery } from '@tanstack/react-query';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';

export const useGetListSimpleLanguage = () => {
    const { data, ...res } = useQuery({
        queryKey: languageQueryKeys.listsSimple(),
        queryFn: () => languageApi.getListSimple(),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const languagesData = data?.data?.data ?? [];

    return {
        languagesData: languagesData,
        ...res,
    };
};
