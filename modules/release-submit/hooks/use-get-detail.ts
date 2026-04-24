import { useQuery } from '@tanstack/react-query';
import { releaseSubmitApis } from '../apis';
import { releaseSubmitQueryKeys } from '../constants/query-keys';
import { ReleaseSubmitData } from '../types';

export const useGetDetailReleaseSubmit = (id?: string | null) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseSubmitQueryKeys.detail(id ?? ''),
        queryFn: () => releaseSubmitApis.getDetail(id ?? ''),
        enabled: !!id,
        placeholderData: (prevData) => prevData,
    });

    return {
        releaseSubmitDetail: data?.data?.data as ReleaseSubmitData | undefined,
        ...rest,
    };
};
