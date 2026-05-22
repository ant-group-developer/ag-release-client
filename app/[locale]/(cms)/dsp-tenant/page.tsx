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

export default function DspTenant() {
    // hooks - state
    const messages = useTranslations();
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const { dataFilter, onSearch } = useFilter<TenantDspDataFilter>({});
    const { isLoading } = useLoadingStatus({
        queryKeys: [tenantDspQueryKeys.lists()],
        mutationKeys: [tenantDspQueryKeys.all],
    });

    // apis
    const { dspData, refetch } = useGetTenantDsps(dataFilter);

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
                    dataSource={dspData}
                    loading={isLoading}
                    headerTitle={
                        <AppSearch
                            className="max-w-52"
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
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
