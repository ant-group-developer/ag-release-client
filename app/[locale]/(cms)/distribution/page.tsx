'use client';
import AppContent from '@/components/ant-music/app-content';
import AppPagination from '@/components/ui/pagination';
import { SCREEN, SESSION_STORAGE_KEY } from '@/enums/common';
import { getScrollYHeight } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';

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
import { useWindowSize } from '@uidotdev/usehooks';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    // hooks - state
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
        pageSize: 21,
    });
    const { height, width } = useWindowSize();
    const typeModal = useModalStore((state) => state.typeModal);

    // apis
    const { releasesData } = useGetListReleases({});

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
        <AppContent>
            <div className="flex-1">
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
                            <span>
                                {messages('distribution.batchTakeDown')}
                            </span>
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
                        x: SCREEN.MD,
                        y: getScrollYHeight(height, width, 90, 39),
                    }}
                />
            </div>

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
                pageSizeOptions={[21, 28, 35]}
            />
        </AppContent>
    );
}
