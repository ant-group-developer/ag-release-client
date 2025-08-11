import { useQuery } from '@tanstack/react-query';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { LanguagesData } from '../types';

export const useGetDetailLanguage = (id: LanguagesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: languageQueryKeys.detail(id),
        queryFn: () => languageApi.getDetail(id),
    });

    const defaultData: LanguagesData = {
        name: '',
        code: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        languageData: data?.data?.data ?? defaultData,
        ...res,
    };
};
