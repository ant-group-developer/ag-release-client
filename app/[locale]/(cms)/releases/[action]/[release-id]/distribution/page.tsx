'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { toastPromise } from '@/helpers/messages-helper';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { useDistributeRelease } from '@/modules/distribution/hooks/use-distribute';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { DistributeRelease } from '@/modules/distribution/types/payload';
import { releaseDspQueryKey } from '@/modules/release-dsp/constants/query-keys';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import {
    ReleaseDspData,
    ReleaseDspDataFilter,
} from '@/modules/release-dsp/types';
import DistributionStatus from '@/modules/releases/components/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useQueryClient } from '@tanstack/react-query';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    // const messages = useTranslations();
    const selectedRow = useReleaseDistribute((state) => state.selectedRows);
    const setSelectedRow = useReleaseDistribute(
        (state) => state.setSelectedRows
    );
    const formValues = useReleaseFormStore((state) => state.formValues);
    const [releaseDspStatus, setReleaseDspStatus] = useState<
        DISTRIBUTION_STATUS | undefined
    >();

    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const handleSelectedRow = (
        _selectedRowKeys: React.Key[],
        selectedRows: ReleaseDspData[]
    ) => {
        setSelectedRow(selectedRows);
    };

    const rowSelection = {
        selectedRowKeys: selectedRow.map((row) => row.dsp?.id),
        onChange: handleSelectedRow,
    };

    const {
        dataFilter,
        onChangeFilter,
        canClearFilter,
        removeFilter,
        onChangePage,
    } = useFilter<ReleaseDspDataFilter>({
        page: 1,
        pageSize: 999,
        status:
            releaseDspStatus === DISTRIBUTION_STATUS.ALL
                ? undefined
                : releaseDspStatus,
    });

    const {
        releaseDsp,
        isFetching: isLoadingReleaseDsp,
        refetch: refetchReleaseDsp,
    } = useGetListReleaseDsp(formValues?.id ?? '', dataFilter);

    useEffect(() => {
        setSelectedRow(
            releaseDsp?.items?.filter((item) => item.isSelected) ?? []
        );
    }, [releaseDsp, setSelectedRow]);

    const { distributeRelease } = useDistributeRelease();

    const { token } = theme.useToken();

    const messages = useTranslations();
    const queryClient = useQueryClient();

    const handleDistribution = () => {
        closeModal();
        let dspCode;
        if (!typeModal) {
            dspCode = selectedRow.map((row) => row.dsp.code);
        } else {
            dspCode = [dataEdit?.dsp?.code];
        }
        const variables: DistributeRelease = {
            id: formValues?.id ?? '',
            code: dspCode ?? [],
            onSuccess(e) {
                queryClient.invalidateQueries({
                    queryKey: releaseDspQueryKey.detail(
                        formValues?.id ?? '',
                        dataFilter
                    ),
                });
                setSelectedRow([]);
            },
        };
        const promise = distributeRelease(variables);
        toastPromise(promise, messages, {
            pending: messages('common.loading'),
        });
    };

    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
    };

    return (
        <div className="flex h-full flex-col justify-between pb-4">
            <div className="space-y-4">
                <div
                    className="flex justify-between rounded-lg p-2"
                    style={{ backgroundColor: token.colorBgContainer }}
                >
                    <DistributionStatus
                        onChangeStatus={(status) => {
                            setReleaseDspStatus(status);
                        }}
                        value={releaseDspStatus}
                    />
                </div>

                <div
                    className="rounded-lg"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    <DistributionTable
                        options={false}
                        dataSource={releaseDsp?.items}
                        scroll={{ x: 'max-content' }}
                        rowSelection={rowSelection}
                        size="large"
                        rowKey={(record) => record.dsp?.id}
                        pagination={{
                            pageSize: dataFilter?.pageSize,
                            total: releaseDsp?.metadata?.totalItems,
                        }}
                        loading={isLoadingReleaseDsp}
                        onChange={onChangeSort}
                        dataFilter={dataFilter}
                    />
                </div>
            </div>

            <AppPagination
                className="rounded-b-lg"
                style={{ backgroundColor: token.colorBgContainer }}
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={releaseDsp?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION && (
                // <DistributionReleaseModal platformIds={selectedRow} />
                <AppConfirm
                    open
                    onOk={handleDistribution}
                    onCancel={closeModal}
                    modalTitle={messages('distribute.label')}
                    paragraph={messages('distribute.confirmDistribute')}
                />
            )}

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN && (
                <AppConfirm
                    open
                    onOk={closeModal}
                    onCancel={closeModal}
                    modalTitle={messages('takeDown.label')}
                    paragraph={messages('takeDown.confirmTakeDown')}
                />
            )}
        </div>
    );
}
