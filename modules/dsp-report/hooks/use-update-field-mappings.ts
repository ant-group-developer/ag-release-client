import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';
import { CommonFunction } from '@/types/api';
import { FieldMapping } from '../types';

interface UpdateFieldMappingsVariables extends CommonFunction {
    parserCode: string;
    dspReportId: string | number;
    payload: { fieldMappings: FieldMapping[] };
}

export const useUpdateFieldMappings = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ parserCode, payload }: UpdateFieldMappingsVariables) =>
            dspReportApi.updateFieldMappings(parserCode, payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: dspReportQueryKeys.ftpParserConfigs(variables.dspReportId),
            });
            variables.onSuccess?.(data);
        },
        onError: (error, variables) => {
            variables.onError?.(error);
        },
    });

    return {
        updateFieldMappings: mutate,
        isPending,
    };
};
