'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import {
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import ArtistRevenueTable from '@/modules/analytics2/components/table/artist-revenue-table';
import ArtistViewsTable from '@/modules/analytics2/components/table/artist-views-table';
import { ContentItem } from '@/modules/analytics2/components/modal/advanced-mode/content-entity-selector';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
} from '@/modules/analytics2/constants/types';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
    type AnalyticsScopeParams,
} from '@/modules/analytics2/helpers';
import { useGetArtistRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopArtist } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { CommonParams } from '@/types/api';
import { Card, Segmented } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

export interface ArtistRankingTableCardProps {
    artistId?: string;
    scopeParams?: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    metricKey?: ANALYTICS_METRIC_KEY;
    onMetricChange?: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    enabled?: boolean;
    className?: string;
    paramPrefix?: string;
}

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function ArtistRankingTableCard({
    artistId,
    scopeParams,
    fromDate,
    toDate,
    releaseType,
    metricKey,
    onMetricChange,
    onSelectEntity,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
    paramPrefix,
}: ArtistRankingTableCardProps) {
    const messages = useTranslations();

    const effectiveFromDate = fromDate || ANALYTICS_DEFAULT_START_DATE;
    const effectiveToDate = toDate || ANALYTICS_DEFAULT_END_DATE;

    const { dspData } = useGetListDsp(
        { pageSize: PAGE_SIZE_EXTRA_LARGE },
        { enabled }
    );

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>(
            {
                page: DEFAULT_PAGE,
                pageSize: PAGE_SIZE_DEFAULT,
                startDate: effectiveFromDate,
                endDate: effectiveToDate,
                type: ANALYTICS_VIEW_TYPE.VIEW,
                releaseType: releaseType || ANALYTICS_RELEASE_TYPE.ALL,
            },
            { paramPrefix, history: paramPrefix ? 'replace' : 'push' }
        );

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(() =>
        getAnalyticsViewType(dataFilter.type ?? null)
    );
    const [selectedReleaseType, setSelectedReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(() =>
            getAnalyticsReleaseType(dataFilter.releaseType ?? null)
        );

    useEffect(() => {
        if (releaseType !== undefined) {
            setSelectedReleaseType(releaseType);
        }
    }, [releaseType]);

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = metricKey
        ? metricKey !== ANALYTICS_METRIC_KEY.TOTAL_VIEWS
        : currentType === ANALYTICS_VIEW_TYPE.REVENUE;
    const revenueSortBy =
        metricKey === ANALYTICS_METRIC_KEY.TOTAL_USAGE
            ? 'usage'
            : metricKey === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
              ? 'revenue'
              : undefined;

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
                artistId,
                ...scopeParams,
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
                sortBy: revenueSortBy,
                groupBySource: true,
                releaseType: requestReleaseType,
                artistId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const handleDetailArtist = (
        artistId: string,
        artistName: string,
        thumbnailUrl?: string | null
    ) => {
        onSelectEntity?.({
            id: artistId,
            title: artistName,
            type: ANALYTICS_ENTITY_TYPE.ARTIST,
            thumbnailUrl: thumbnailUrl || undefined,
        });
    };

    const handleDetailSource = (sourceType: string, title: string) => {
        onSelectEntity?.({
            id: sourceType,
            title,
            type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
        });
    };

    const toolbarConfig = {
        search: (
            <AppSearch
                onChange={onSearch}
                defaultValue={dataFilter.keyword}
                style={{ width: 200 }}
            />
        ),
        actions: [
            <Segmented
                key="releaseType"
                value={selectedReleaseType}
                onChange={(value) => {
                    const selectedType = value as ANALYTICS_RELEASE_TYPE;
                    setSelectedReleaseType(selectedType);
                    onChangeFilter({
                        releaseType:
                            selectedType === ANALYTICS_RELEASE_TYPE.ALL
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
            />,
            <Segmented
                key="metricType"
                value={
                    isRevenue
                        ? ANALYTICS_VIEW_TYPE.REVENUE
                        : ANALYTICS_VIEW_TYPE.VIEW
                }
                onChange={(value) => {
                    const nextType = value as ANALYTICS_VIEW_TYPE;
                    setCurrentType(nextType);
                    if (onMetricChange) {
                        onMetricChange(
                            nextType === ANALYTICS_VIEW_TYPE.VIEW
                                ? ANALYTICS_METRIC_KEY.TOTAL_VIEWS
                                : ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
                        );
                        return;
                    }
                    onChangeFilter({ type: nextType });
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
            />,
        ],
    };

    return (
        <Card className={className}>
            {isRevenue ? (
                <ArtistRevenueTable
                    toolbar={toolbarConfig}
                    dataSource={topArtistData.items}
                    loading={isFetching}
                    dspData={dspData}
                    onDetailArtist={handleDetailArtist}
                    onDetailSource={handleDetailSource}
                />
            ) : (
                <ArtistViewsTable
                    toolbar={toolbarConfig}
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
    );
}

