'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import {
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import DetailArtistAnalyticsModal from '@/modules/analytics2/components/detail-artist/detail-artist-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import ArtistRevenueTable from '@/modules/analytics2/components/table/artist-revenue-table';
import ArtistViewsTable from '@/modules/analytics2/components/table/artist-views-table';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetArtistRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopArtist } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
}

export default function ArtistsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const { dspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            type: ANALYTICS_VIEW_TYPE.VIEW,
        });

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
    const isRevenue = dataFilter.type === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { artistRankingData, isFetching: isViewsFetching } =
        useGetArtistRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                groupBySource: true,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topArtistData, isFetching: isRevenueFetching } =
        useGetRevenueTopArtist(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                includeOther: false,
                groupBySource: true,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const pageTitle = isRevenue
        ? `${messages('artist.artists')} - ${messages('common.revenue')}`
        : `${messages('artist.artists')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS,
        },
        {
            title: pageTitle,
        },
    ];

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
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <PageContainer
                title={pageTitle}
                header={{
                    breadcrumb: {
                        items: breadcrumbs,
                    },
                }}
                extra={
                    <DateSelect2
                        style={{ width: 240 }}
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                        onChange={(value) => {
                            const [start, end] = value.toString().split(',');
                            onChangeFilter({
                                startDate: start,
                                endDate: end,
                            });
                        }}
                    />
                }
            >
                <Card className="rounded-xl border-none shadow-sm">
                    <div className="mb-4 flex items-center gap-4">
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ width: 200 }}
                        />
                        <Segmented
                            value={dataFilter.type ?? ANALYTICS_VIEW_TYPE.VIEW}
                            onChange={(value) => {
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
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                    />
                )}

                {detailSourceModal.open && (
                    <DetailSourceTypeAnalyticsModal
                        open={detailSourceModal.open}
                        onClose={() =>
                            setDetailSourceModal((prev) => ({ ...prev, open: false }))
                        }
                        title={detailSourceModal.title}
                        sourceType={detailSourceModal.sourceType}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                    />
                )}
            </PageContainer>
        </div>
    );
}
