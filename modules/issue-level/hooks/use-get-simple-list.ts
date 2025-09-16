import { useQuery } from '@tanstack/react-query';
import { issueLevelApis } from '../apis';
import { issueLevelQueryKeys } from '../constants/query-keys';
import { IssueLevelData } from '../types';

export const useGetListSimpleIssueLevel = () => {
    const { data, ...res } = useQuery({
        queryKey: issueLevelQueryKeys.list(),
        queryFn: () => issueLevelApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const issueLevelSimpleData = data?.data?.data ?? ([] as IssueLevelData[]);

    return {
        issueLevelSimpleData,
        ...res,
    };
};
