'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppSearch from '@/components/ui/input/search';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import DspTenantModal from '@/modules/dsp-tenant/components/modal/dsp-tenant-modal';
import { DspTenantTable } from '@/modules/dsp-tenant/components/table';
import { tenantDspQueryKeys } from '@/modules/dsp-tenant/constants/query-keys';
import { TYPE_MODAL_DSP_TENANT } from '@/modules/dsp-tenant/enums';
import { useGetTenantDsps } from '@/modules/dsp-tenant/hooks/use-get-tenant-dsps';
import { TenantDspDataFilter } from '@/modules/dsp-tenant/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export default function DspTenant() {
    // hooks - state
    const messages = useTranslations();
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const { dataFilter } = useFilter<TenantDspDataFilter>({});
    const [keyword, setKeyword] = useState<string>('');
    const { isLoading } = useLoadingStatus({
        queryKeys: [tenantDspQueryKeys.lists()],
        mutationKeys: [tenantDspQueryKeys.all],
    });

    // apis
    const { dspData, refetch } = useGetTenantDsps({
        ...dataFilter,
    });

    const filteredData = useMemo(() => {
        if (!keyword) return dspData;
        const lowerKeyword = keyword.toLowerCase();
        return dspData.filter((item) =>
            item.dsp?.name?.toLowerCase().includes(lowerKeyword)
        );
    }, [dspData, keyword]);

    // func
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('dsp.label')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
            >
                <DspTenantTable
                    className="rounded-t-lg"
                    sticky
                    dataSource={filteredData}
                    loading={isLoading}
                    headerTitle={
                        <AppSearch
                            className="max-w-52"
                            onChange={(e) => setKeyword(e.target.value)}
                            onSearch={(value) => setKeyword(value)}
                        />
                    }
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                {typeModal === TYPE_MODAL_DSP_TENANT.UPDATE && (
                    <DspTenantModal />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
