import { useQuery } from '@tanstack/react-query';
import { integrationApis } from '../apis';
import { integrationQueryKeys } from '../constants';
import { IntegrationData } from '../types';

export const useGetDetailIntegration = (id: IntegrationData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: integrationQueryKeys.detail(id),
        queryFn: () => integrationApis.getDetail(id),
        placeholderData: (prev) => prev,
        enabled: !!id,
    });

    const defaultData: IntegrationData = {
        modifierId: '',
        isActive: false,
        dspId: '',
        dsp: undefined,
        tenantId: '',
        tenant: undefined,
        agreementType: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        connections: undefined,
    };

    return {
        integrationData: data?.data?.data ?? defaultData,
        ...res,
    };
};
