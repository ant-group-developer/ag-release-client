import { useQuery } from '@tanstack/react-query';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { TimezoneData } from '../types';

export const useGetDetailTimezone = (id: TimezoneData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...timezoneQueryKeys.getDetail, id],
        queryFn: () => timezoneApi.getDetail(id),
    });

    const defaultData: TimezoneData = {
        name: '',
        utc: '',
        zone: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        timezonesData: data?.data?.data ?? defaultData,
        ...res,
    };
};
