import { useQuery } from '@tanstack/react-query';
import { settingApis } from '../apis';
import { settingQueryKeys } from '../constants/query-keys';
import { SettingData } from '../types';

export const useGetSetting = () => {
    const { data, ...res } = useQuery({
        queryKey: settingQueryKeys.details(),
        queryFn: () => settingApis.getSetting(),
    });

    return {
        settingData: data?.data?.data ?? ({} as SettingData),
        ...res,
    };
};
