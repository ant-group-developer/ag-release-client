import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelDataFilter } from '../types';

export const useGetListLabels = (params: LabelDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: labelsQueryKeys.list(params),
        queryFn: () => labelsApi.getList(params),
    });

    const labelsData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        labelsData,
        lastUpdatedAt,
        ...res,
    };
};
