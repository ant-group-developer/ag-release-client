import { useQuery } from '@tanstack/react-query';
import { issuesApis } from '../apis';
import { issuesQueryKeys } from '../constants/query-keys';
import { IssueData } from '../types';

export const useGetListSimpleIssue = () => {
    const { data, ...res } = useQuery({
        queryKey: issuesQueryKeys.list(),
        queryFn: () => issuesApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const issueSimpleData = data?.data?.data ?? ([] as IssueData[]);

    return {
        issueSimpleData,
        ...res,
    };
};
