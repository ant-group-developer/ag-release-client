import { useQuery } from '@tanstack/react-query';
import { settingApis } from '../apis';
import { settingQueryKeys } from '../constants/query-keys';
import { SettingConfig } from '../types';

export const useGetSetting = () => {
    const { data, ...res } = useQuery({
        queryKey: settingQueryKeys.details(),
        queryFn: () => settingApis.getSetting(),
    });

    return {
        settingData: data?.data?.data,
        settingConfig: data?.data?.data?.config as SettingConfig,
        ...res,
    };
};
