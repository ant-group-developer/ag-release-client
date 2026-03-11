'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { toastPromise } from '@/helpers/messages-helper';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { useDistributeRelease } from '@/modules/distribution/hooks/use-distribute';
import { DistributionDataFilter } from '@/modules/distribution/types';
import { DistributeRelease } from '@/modules/distribution/types/payload';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import DistributionStatus from '@/modules/releases/components/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    // const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<ReleaseDspData[]>([]);
    const formValues = useReleaseFormStore((state) => state.formValues);

    const openModal = useModalStore((state) => state.openModal);

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
    } = useFilter<DistributionDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const { releaseDsp, isLoading } = useGetListReleaseDsp(
        formValues?.id ?? ''
    );
    const { distributeRelease } = useDistributeRelease();

    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const messages = useTranslations();

    const handleDistribution = () => {
        closeModal();
        const dspCode = selectedRow.map((row) => row.dsp.code);
        const variables: DistributeRelease = {
            id: formValues?.id ?? '',
            code: dspCode ?? [],
        };
        const promise = distributeRelease(variables);
        toastPromise(promise, messages);
    };

    return (
        <div className="flex h-full flex-col justify-between pb-4">
            <div className="space-y-4">
                <div
                    className="flex justify-between rounded-lg p-2"
                    style={{ backgroundColor: token.colorBgContainer }}
                >
                    <DistributionStatus
                        onChangeFilter={onChangeFilter}
                        value={dataFilter.status ?? DISTRIBUTION_STATUS.ALL}
                    />
                    {selectedRow.length > 0 && (
                        <div className="flex items-center gap-4 px-4 font-medium">
                            <Button
                                onClick={() => {
                                    openModal(
                                        TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION
                                    );
                                }}
                                className=""
                                type="primary"
                                // disabled={errorsLength > 0}
                            >
                                <span>
                                    {messages('common.distribute')}{' '}
                                    {selectedRow.length}/{releaseDsp?.length}
                                </span>
                            </Button>
                            <Button
                                onClick={() => {
                                    openModal(
                                        TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN
                                    );
                                }}
                                danger
                                // disabled={errorsLength > 0}
                            >
                                <span>
                                    {messages('common.takeDown')}{' '}
                                    {selectedRow.length}/{releaseDsp?.length}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>

                <DistributionTable
                    dataSource={releaseDsp}
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    size="large"
                    rowKey={(record) => record.dsp?.id}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: 1,
                    }}
                />
            </div>

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION && (
                // <DistributionReleaseModal platformIds={selectedRow} />
                <AppConfirm
                    open
                    onOk={handleDistribution}
                    onCancel={closeModal}
                    modalTitle="Phát hành"
                    paragraph="Bạn có chắc chắn muốn phát hành trên nền tảng này không?"
                />
            )}

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN && (
                <AppConfirm
                    open
                    onOk={closeModal}
                    onCancel={closeModal}
                    modalTitle="Gỡ khỏi nền tảng"
                    paragraph="Bạn có chắc chắn muốn gỡ khỏi nền tảng này không?"
                />
            )}

            <AppPagination
                className="rounded-b-lg"
                style={{ backgroundColor: token.colorBgContainer }}
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={releaseDsp?.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
