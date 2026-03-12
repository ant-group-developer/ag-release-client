'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import { toastPromise } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { useDistributeRelease } from '@/modules/distribution/hooks/use-distribute';
import { DistributeRelease } from '@/modules/distribution/types/payload';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import DistributionStatus from '@/modules/releases/components/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    // const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<ReleaseDspData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const [releaseDspStatus, setReleaseDspStatus] =
        useState<DISTRIBUTION_STATUS>(DISTRIBUTION_STATUS.ALL);

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

    // const {
    //     dataFilter,
    //     onChangeFilter,
    //     canClearFilter,
    //     removeFilter,
    //     onChangePage,
    // } = useFilter<DistributionDataFilter>({
    //     page: 1,
    //     pageSize: PAGE_SIZE,
    // });

    const { releaseDsp, isLoading: isLoadingReleaseDsp } = useGetListReleaseDsp(
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

    const dataSource = useMemo(() => {
        if (releaseDspStatus === DISTRIBUTION_STATUS.ALL) {
            return releaseDsp;
        }
        return releaseDsp?.filter((item) => {
            const status = item.status as any;
            if (status === DISTRIBUTION_STATUS.ALL) return true;
            return status == releaseDspStatus;
        });
    }, [releaseDsp, releaseDspStatus]);

    return (
        <div className="flex h-full flex-col justify-between pb-4">
            <div className="space-y-4">
                <div
                    className="flex justify-between rounded-lg p-2"
                    style={{ backgroundColor: token.colorBgContainer }}
                >
                    <DistributionStatus
                        setReleaseDspStatus={setReleaseDspStatus}
                        value={releaseDspStatus}
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

                <div
                    className="rounded-lg"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    <DistributionTable
                        dataSource={dataSource}
                        scroll={{ x: 'max-content' }}
                        rowSelection={rowSelection}
                        size="large"
                        rowKey={(record) => record.dsp?.id}
                        currentPage={currentPage}
                        pagination={{
                            current: currentPage,
                            pageSize: 10,
                            total: dataSource?.length,
                            onChange: (page) => setCurrentPage(page),
                        }}
                        loading={isLoadingReleaseDsp}
                    />
                </div>
            </div>

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
