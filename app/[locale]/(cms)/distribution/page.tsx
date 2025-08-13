'use client';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTableScrollY } from '@/hooks/use-table-scroll-y';

import DistributionHeader from '@/modules/distribution/components/header';
import DistributionStatus from '@/modules/distribution/components/header-action/distribution-status';
import DetailDistributionModal from '@/modules/distribution/components/modal/detail-distribution';
import DistributionTable from '@/modules/distribution/components/table';
import { defaultVisibleColumnsDistribution } from '@/modules/distribution/constants';
import {
    DISTRIBUTION_COLUMNS_DISPLAY,
    DISTRIBUTION_STATUS,
    TYPE_MODAL_DISTRIBUTION,
} from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    // hooks - state
    const scrollY = useTableScrollY();
    const messages = useTranslations();
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
    const typeModal = useModalStore((state) => state.typeModal);

    // apis
    const { releasesData, isFetching } = useGetListReleases({});

    // func
    const handleChangeVisibleColumns = (
        columns: DISTRIBUTION_COLUMNS_DISPLAY[]
    ) => {
        setVisibleColumns(columns);
    };
    const handleRefresh = () => {};

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_DISTRIBUTION,
                JSON.stringify({
                    value: visibleColumns,
                    timestamp: dayjs().toISOString(),
                })
            );
        }
    }, [visibleColumns]);
    return (
        <div>
            <div className="flex justify-between border-b">
                <DistributionStatus
                    onChangeFilter={onChangeFilter}
                    value={dataFilter.status ?? DISTRIBUTION_STATUS.ALL}
                />
                <div className="flex items-center gap-4 px-4 font-medium">
                    <Button className="" type="primary">
                        <span>
                            {messages('distribution.batchDistribution')}
                        </span>
                    </Button>
                    <Button danger>
                        <span>{messages('distribution.batchTakeDown')}</span>
                    </Button>
                </div>
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
                visibleColumns={visibleColumns}
                dataSource={releasesData?.items}
                scroll={{
                    y: scrollY,
                }}
                pagination={{
                    pageSize: dataFilter.pageSize,
                    current: releasesData.metadata.currentPage,
                    total: releasesData.metadata.totalItems,
                }}
                loading={isFetching}
            />

            {typeModal === TYPE_MODAL_DISTRIBUTION.DETAIL && (
                <DetailDistributionModal open />
            )}

            <AppPagination
                className="border-t"
                align="end"
                current={releasesData.metadata.currentPage}
                pageSize={dataFilter.pageSize}
                total={releasesData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
