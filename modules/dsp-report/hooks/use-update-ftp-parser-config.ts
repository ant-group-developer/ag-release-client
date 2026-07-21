import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';
import { CommonFunction } from '@/types/api';
import { FtpParserConfig } from '../types';

interface UpdateVariables extends CommonFunction {
    id: string;
    category: string;
    payload: Partial<FtpParserConfig>;
}

export const useUpdateFtpParserConfig = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, category, payload }: UpdateVariables) =>
            dspReportApi.updateFtpParserConfig(id, category, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: dspReportQueryKeys.ftpParserConfigs(variables.id),
            });
            variables.onSuccess?.(data);
        },
        onError: (error, variables) => {
            variables.onError?.(error);
        },
    });

    return {
        updateFtpParserConfig: mutate,
        isPending,
    };
};
