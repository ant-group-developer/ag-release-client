import { useQuery } from '@tanstack/react-query';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';

export const useGetListSimpleTimezones = () => {
    const { data, ...res } = useQuery({
        queryKey: timezoneQueryKeys.listsSimple(),
        queryFn: () => timezoneApi.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const timezonesData = data?.data?.data ?? [];

    return {
        timezonesData,
        ...res,
    };
};
