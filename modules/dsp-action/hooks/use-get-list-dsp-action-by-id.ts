import { dspActionQueryKeys } from '@/modules/dsp-action/constants/query-keys';
import { DspData } from '@/modules/dsp/types';
import { useQuery } from '@tanstack/react-query';
import { dspActionApis } from '../apis';
import { DspActionData } from '../types';

export const useGetListDspActionByDspId = (
    id: DspData['id'],
    options?: { enabled: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: dspActionQueryKeys.lists(),
        queryFn: () => dspActionApis.getListDspActionByDspId(id),
        placeholderData: (prev) => prev,
        enabled: !!id && (options?.enabled ?? true),
    });

    const dspActionsData = data?.data?.data ?? ([] as DspActionData[]);

    return {
        dspActionsData,
        ...res,
    };
};
