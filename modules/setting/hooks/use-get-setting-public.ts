import { useQuery } from '@tanstack/react-query';
import { settingApis } from '../apis';
import { settingQueryKeys } from '../constants/query-keys';
import { SettingConfig } from '../types';

export const useGetSettingPublic = () => {
    const { data, ...res } = useQuery({
        queryKey: settingQueryKeys.detailsPublic(),
        queryFn: () => settingApis.getSettingPublic(),
    });

    return {
        settingData: data?.data?.data,
        settingConfig: data?.data?.data?.config as SettingConfig,
        ...res,
    };
};
