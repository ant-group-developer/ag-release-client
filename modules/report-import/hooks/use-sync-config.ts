import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslations } from 'next-intl';
import { QUERY_KEY } from '@/constants/query-key';
import { etlSyncConfigApis } from '../apis';
import { SyncConfigData } from '../types';

export const useGetSyncConfig = () => {
    const { data, ...res } = useQuery({
        queryKey: ['etl-sync-config'] as const,
        queryFn: () => etlSyncConfigApis.get(),
    });

    return {
        syncConfigData: data?.data?.data,
        ...res,
    };
};

export const useUpdateSyncConfig = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const mutation = useMutation({
        mutationFn: (payload: SyncConfigData) =>
            etlSyncConfigApis.update(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['etl-sync-config'],
            });
            message.success(
                messages(
                    'reportConfigs.sftpExcludePatterns.syncConfig.saveSuccess'
                )
            );
        },
        onError: (error: any) => {
            const errMsg =
                error?.response?.data?.message ||
                messages(
                    'reportConfigs.sftpExcludePatterns.syncConfig.saveFailed'
                );
            message.error(errMsg);
        },
    });

    return {
        updateSyncConfig: mutation.mutate,
        ...mutation,
    };
};

export const useStartFtpSync = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const mutation = useMutation({
        mutationFn: (payload: { period: string; force: boolean; categories?: string[] }) =>
            etlSyncConfigApis.sync(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.ETL_JOBS.KEY],
            });
            message.success(
                messages('reportConfigs.sftpExcludePatterns.sync.success')
            );
        },
        onError: (error: any) => {
            const errMsg =
                error?.response?.data?.message ||
                messages('message.somethingWentWrong');
            message.error(errMsg);
        },
    });

    return {
        startFtpSync: mutation.mutate,
        ...mutation,
    };
};

export const useStartFtpSyncAll = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const mutation = useMutation({
        mutationFn: (payload: { startPeriod: string; force: boolean; categories?: string[] }) =>
            etlSyncConfigApis.syncAll(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.ETL_JOBS.KEY],
            });
            message.success(
                messages('reportConfigs.sftpExcludePatterns.sync.success')
            );
        },
        onError: (error: any) => {
            const errMsg =
                error?.response?.data?.message ||
                messages('message.somethingWentWrong');
            message.error(errMsg);
        },
    });

    return {
        startFtpSyncAll: mutation.mutate,
        ...mutation,
    };
};
