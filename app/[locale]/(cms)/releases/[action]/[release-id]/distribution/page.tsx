'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { SCREEN, SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import {
    defaultVisibleColumnsDistribution,
    distributionData,
} from '@/modules/distribution/constants';
import {
    DISTRIBUTION_COLUMNS_DISPLAY,
    DISTRIBUTION_STATUS,
} from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import DistributionHeader from '@/modules/release-detail/release-distribution/components/header';
import DistributionStatus from '@/modules/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionReleaseModal from '@/modules/release-detail/release-distribution/components/modal/distribution-release';
import DistributionTable from '@/modules/release-detail/release-distribution/components/table';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { useWindowSize } from '@uidotdev/usehooks';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { Key, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
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

    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const header = 64;
        const pageHeader = 204;
        const pageAction = 49;
        const pageFilter = 49;
        const pagination = 58;
        const headerTable = 39;
        const headerFooterHeight =
            header +
            pageHeader +
            pageFilter +
            pagination +
            headerTable +
            pageAction;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };
    const handleRefresh = () => {};

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="">
                <div className="flex justify-between border-b">
                    <DistributionStatus
                        onChangeFilter={onChangeFilter}
                        value={
                            dataFilter.status ?? DISTRIBUTION_STATUS.PROGRESS
                        }
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
                            >
                                <span>Phân phối</span>
                            </Button>
                            <Button
                                onClick={() => {
                                    openModal(
                                        TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN
                                    );
                                }}
                                danger
                            >
                                <span>Gỡ xuống</span>
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
                    scroll={{ y: 65 * 6.6 }}
                    rowSelection={rowSelection}
                    size="large"
                />
            </div>

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION && (
                <DistributionReleaseModal platformIds={selectedRow} />
            )}

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN && (
                <AppConfirm
                    open
                    onOk={closeModal}
                    onCancel={closeModal}
                    modalTitle="Gỡ xuống bản phát hành"
                    paragraph="Bạn có chắc chắn muốn gỡ xuống bản phát hành này không?"
                />
            )}

            <AppPagination
                className="border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={distributionData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 35]}
            />
        </div>
    );
}
