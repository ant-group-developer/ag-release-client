'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import AggregatorForm from '@/modules/aggregator/components/form/aggregator-form';
import AggregatorTable from '@/modules/aggregator/components/table/aggregator-table';
import { aggregatorQueryKeys } from '@/modules/aggregator/constants/query-keys';
import { TYPE_MODAL_AGGREGATOR } from '@/modules/aggregator/enums';
import { useDeleteAggregator } from '@/modules/aggregator/hooks/use-delete';
import { useGetListAggregator } from '@/modules/aggregator/hooks/use-get-list';
import {
    AggregatorData,
    AggregatorDataFilter,
} from '@/modules/aggregator/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Aggregator({}: Props) {
    // hooks
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, removeFilter, onChangePage, onSearch } =
        useFilter<AggregatorDataFilter>({
            pageSize: PAGE_SIZE,
        });
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<AggregatorData>((state) => state.dataEdit);
    const openModal = useModalStore((state) => state.openModal);
    const { isLoading } = useLoadingStatus({
        queryKeys: [aggregatorQueryKeys.lists()],
        mutationKeys: [aggregatorQueryKeys.all],
    });

    // apis
    const {
        aggregatorsData,
        refetch: aggregatorsRefetch,
        isFetching,
    } = useGetListAggregator(dataFilter);
    const { deleteAggregator } = useDeleteAggregator();

    // func
    const handleDeleteAggregator = () => {
        const variables: DeleteVariables<AggregatorData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteAggregator(variables);
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('aggregator.aggregators')}
                extra={
                    <CreateButton
                        canCreate
                        onClick={() => openModal(TYPE_MODAL_AGGREGATOR.CREATE)}
                    />
                }
            >
                {/* <AggregatorHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    removeFilter={removeFilter}
                /> */}
                <AggregatorTable
                    headerTitle={
                        <AppSearch
                            className="max-w-52"
                            onChange={onSearch}
                            defaultValue={dataFilter?.keyword}
                        />
                    }
                    sticky
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        current: aggregatorsData?.metadata?.page,
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                    }}
                    dataSource={aggregatorsData?.items}
                    options={{
                        reload: () => aggregatorsRefetch(),
                    }}
                    loading={isLoading}
                />
                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={aggregatorsData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={aggregatorsData?.metadata.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_AGGREGATOR.CREATE ||
                    typeModal === TYPE_MODAL_AGGREGATOR.UPDATE) && (
                    <AggregatorForm open onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_AGGREGATOR.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDeleteAggregator()}
                        onCancel={closeModal}
                        modalTitle={`${messages('artist.delete')} `}
                        paragraph={messages.rich('delete.confirmMessageValue', {
                            value: dataEdit?.name,
                            b: (chuck) => <strong>{chuck}</strong>,
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
