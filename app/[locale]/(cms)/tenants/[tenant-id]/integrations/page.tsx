'use client';

import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import IntegrationModalForm from '@/modules/integration/components/modal/integration-modal-form';
import IntegrationTable from '@/modules/integration/components/table/intergration-table';
import { integrationQueryKeys } from '@/modules/integration/constants';
import { TYPE_MODAL_INTEGRATION } from '@/modules/integration/enums';
import { useGetListIntegration } from '@/modules/integration/hooks/use-get-list';
import { theme } from 'antd';

type Props = {};

function TenantDeals({}: Props) {
    // const messages = useTranslations();
    const { token } = theme.useToken();
    const { dataFilter, onChangePage, onChangeFilter } = useFilter({
        pageSize: PAGE_SIZE,
    });

    const { isLoading } = useLoadingStatus({
        queryKeys: [integrationQueryKeys.lists()],
        mutationKeys: [integrationQueryKeys.all],
    });

    const {
        integrationsData,
        refetch: integrationsRefetch,
        isFetching: integrationLoading,
    } = useGetListIntegration(dataFilter);

    // const value = useParams();
    // const tenantId = value['tenant-id'] as string;

    // const openModal = useModalStore((state) => state.openModal);
    // const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore<TYPE_MODAL_INTEGRATION>(
        (state) => state.typeModal
    );

    // const { dspData, isFetching } = useGetListDsp({
    //     pageSize: 999,
    // });
    // const { dataTenantDsp } = useTenantDsp(tenantId);
    // const { updateTenantDsp, isPending } = useUpdateTenantDsp();

    // const onSubmit = () => {
    //     const data: any[] = [];
    //     dataSource.forEach((item) => {
    //         if (item.isSelected) {
    //             data.push({
    //                 dspId: item.id,
    //                 isActive: item.isActive,
    //             });
    //         }
    //     });

    //     updateTenantDsp({
    //         payload: { tenantId, data },
    //     });
    // };

    return (
        <div>
            <IntegrationTable
                sticky={{
                    offsetHeader: 170,
                }}
                dataSource={integrationsData?.items}
                dataFilter={dataFilter}
                pagination={{
                    current: integrationsData?.metadata?.page,
                    pageSize: dataFilter?.pageSize,
                }}
                loading={isLoading}
                options={{
                    reload: () => integrationsRefetch(),
                }}
            />
            <AppPagination
                className="rounded-b-md"
                style={{ backgroundColor: token.colorBgContainer }}
                align="end"
                current={integrationsData?.metadata?.page}
                pageSize={dataFilter.pageSize}
                total={integrationsData?.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {/* <div className="mt-2 text-right">
                <SubmitButton onClick={onSubmit} loading={isPending} />
            </div> */}

            {typeModal === TYPE_MODAL_INTEGRATION.UPDATE && (
                <IntegrationModalForm open />
            )}
        </div>
    );
}

export default TenantDeals;
