'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import {
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import DetailArtistAnalyticsModal from '@/modules/analytics2/components/detail-artist/detail-artist-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import ArtistRevenueTable from '@/modules/analytics2/components/table/artist-revenue-table';
import ArtistViewsTable from '@/modules/analytics2/components/table/artist-views-table';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetArtistRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopArtist } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { CommonParams } from '@/types/api';
import { Card, Segmented } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

export interface ArtistRankingTableCardProps {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    enabled?: boolean;
    className?: string;
}

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function ArtistRankingTableCard({
    fromDate,
    toDate,
    releaseType,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
}: ArtistRankingTableCardProps) {
    const messages = useTranslations();

    const effectiveFromDate = fromDate || ANALYTICS_DEFAULT_START_DATE;
    const effectiveToDate = toDate || ANALYTICS_DEFAULT_END_DATE;

    const { dspData } = useGetListDsp(
        { pageSize: PAGE_SIZE_EXTRA_LARGE },
        { enabled }
    );

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: effectiveFromDate,
            endDate: effectiveToDate,
            type: ANALYTICS_VIEW_TYPE.VIEW,
            releaseType: releaseType || ANALYTICS_RELEASE_TYPE.ALL,
        });

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(
        ANALYTICS_VIEW_TYPE.VIEW
    );
    const [selectedReleaseType, setSelectedReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(
            releaseType || ANALYTICS_RELEASE_TYPE.ALL
        );

    useEffect(() => {
        if (releaseType !== undefined) {
            setSelectedReleaseType(releaseType);
        }
    }, [releaseType]);

    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        title: string;
        artistId: string;
    }>({
        open: false,
        title: '',
        artistId: '',
    });

    const [detailSourceModal, setDetailSourceModal] = useState<{
        open: boolean;
        title: string;
        sourceType: string;
    }>({
        open: false,
        title: '',
        sourceType: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;

    const requestReleaseType =
        selectedReleaseType === ANALYTICS_RELEASE_TYPE.ALL
            ? undefined
            : selectedReleaseType;

    // Fetch ranking data (Views)
    const { artistRankingData, isFetching: isViewsFetching } =
        useGetArtistRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: enabled && !isRevenue }
        );

    // Fetch revenue ranking data
    const { topArtistData, isFetching: isRevenueFetching } =
        useGetRevenueTopArtist(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                includeOther: false,
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const handleDetailArtist = (artistId: string, artistName: string) => {
        setDetailModal({
            open: true,
            title: artistName,
            artistId,
        });
    };

    const handleDetailSource = (sourceType: string, title: string) => {
        setDetailSourceModal({
            open: true,
            title,
            sourceType,
        });
    };

    return (
        <>
            <Card className={className}>
                <div className="mb-4 flex items-center gap-2">
                    <AppSearch
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                        style={{ width: 200 }}
                    />
                    <Segmented
                        value={selectedReleaseType}
                        onChange={(value) => {
                            const selectedType =
                                value as ANALYTICS_RELEASE_TYPE;
                            setSelectedReleaseType(selectedType);
                            onChangeFilter({
                                releaseType:
                                    selectedType ===
                                    ANALYTICS_RELEASE_TYPE.ALL
                                        ? undefined
                                        : selectedType,
                            });
                        }}
                        options={[
                            {
                                label: messages('common.all'),
                                value: ANALYTICS_RELEASE_TYPE.ALL,
                            },
                            {
                                label: messages('common.audio'),
                                value: ANALYTICS_RELEASE_TYPE.AUDIO,
                            },
                            {
                                label: messages('common.video'),
                                value: ANALYTICS_RELEASE_TYPE.VIDEO,
                            },
                        ]}
                    />
                    <Segmented
                        value={currentType}
                        onChange={(value) => {
                            setCurrentType(value as ANALYTICS_VIEW_TYPE);
                            onChangeFilter({
                                type: value as ANALYTICS_VIEW_TYPE,
                            });
                        }}
                        options={[
                            {
                                label: messages('common.views'),
                                value: ANALYTICS_VIEW_TYPE.VIEW,
                            },
                            {
                                label: messages('common.revenue'),
                                value: ANALYTICS_VIEW_TYPE.REVENUE,
                            },
                        ]}
                    />
                </div>
                {isRevenue ? (
                    <ArtistRevenueTable
                        dataSource={topArtistData.items}
                        loading={isFetching}
                        dspData={dspData}
                        onDetailArtist={handleDetailArtist}
                        onDetailSource={handleDetailSource}
                    />
                ) : (
                    <ArtistViewsTable
                        dataSource={artistRankingData.items}
                        loading={isFetching}
                        dspData={dspData}
                        onDetailArtist={handleDetailArtist}
                        onDetailSource={handleDetailSource}
                    />
                )}
                <AppPagination
                    align="end"
                    className="!mt-4"
                    current={page}
                    pageSize={pageSize}
                    total={
                        isRevenue
                            ? topArtistData?.metadata?.totalItems || 0
                            : artistRankingData?.metadata?.totalItems || 0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </Card>

            {detailModal.open && (
                <DetailArtistAnalyticsModal
                    open={detailModal.open}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, open: false }))
                    }
                    title={detailModal.title}
                    artistId={detailModal.artistId}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}

            {detailSourceModal.open && (
                <DetailSourceTypeAnalyticsModal
                    open={detailSourceModal.open}
                    onClose={() =>
                        setDetailSourceModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailSourceModal.title}
                    sourceType={detailSourceModal.sourceType}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}
        </>
    );
}
