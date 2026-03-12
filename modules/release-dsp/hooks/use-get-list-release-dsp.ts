import { useQuery } from '@tanstack/react-query';
import { releaseDspApis } from '../apis';
import { releaseDspQueryKey } from '../constants/query-keys';

export const useGetListReleaseDsp = (id: string) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseDspQueryKey.detail(id),
        queryFn: () => releaseDspApis.getListDspDistribute(id),
    });

    return {
        releaseDsp: data?.data?.data ?? [],
        ...rest,
    };
};
