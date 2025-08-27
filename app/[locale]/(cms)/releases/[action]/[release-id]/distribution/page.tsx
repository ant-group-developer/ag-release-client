'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import {
    defaultVisibleColumnsDistribution,
    distributionData,
} from '@/modules/distribution/constants';
import {
    DISTRIBUTION_COLUMNS_DISPLAY,
    DISTRIBUTION_STATUS,
} from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import DistributionHeader from '@/modules/releases/components/release-detail/release-distribution/components/header';
import DistributionStatus from '@/modules/releases/components/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<
        DISTRIBUTION_COLUMNS_DISPLAY[]
    >(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_DISTRIBUTION
            );
            if (!stored) return defaultVisibleColumnsDistribution;
            const { value, timestamp } = JSON.parse(stored) as {
                value: DISTRIBUTION_COLUMNS_DISPLAY[];
                timestamp: string;
            };

            if (dayjs().diff(dayjs(timestamp), 'day') >= 10) {
                sessionStorage.removeItem(
                    SESSION_STORAGE_KEY.VISIBLE_COLUMNS_DISTRIBUTION
                );
                return defaultVisibleColumnsDistribution;
            }

            return value;
        }
        return defaultVisibleColumnsDistribution;
    });

    const openModal = useModalStore((state) => state.openModal);

    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const rowSelection = {
        selectedRow,
        onChange: handleSelectedRow,
    };

    const handleChangeVisibleColumns = (
        columns: DISTRIBUTION_COLUMNS_DISPLAY[]
    ) => {
        setVisibleColumns(columns);
    };
    const {
        dataFilter,
        onChangeFilter,
        canClearFilter,
        removeFilter,
        onChangePage,
    } = useFilter<DistributionDataFilter>({
        page: 1,
        pageSize: 21,
    });

    // const { height, width } = useWindowSize();
    // const isSmallDevice = Number(width) <= SCREEN.MD;
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const releaseId = formValues?.id || '';
    const router = useRouter();

    const handleRefresh = () => {};

    const dataTable = distributionData.filter((item) => {
        return selectedRow.includes(item.id);
    });

    const handleDistribution = () => {
        setFormValues({
            ...formValues,
            // platforms: selectedRow as string[],
        });
        closeModal();
        router.push(`/releases/detail/${releaseId}/review`);
    };

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="">
                <div className="flex justify-between border-b">
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
                                    Phân phối {selectedRow.length}/
                                    {distributionData.length}
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
                                    Gỡ xuống {selectedRow.length}/
                                    {distributionData.length}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>

                <DistributionHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                />

                <DistributionTable
                    dataSource={distributionData}
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    size="large"
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
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={distributionData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
