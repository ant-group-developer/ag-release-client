'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    useGetRevenueTopArtist,
    useGetRevenueTopDsp,
    useGetRevenueTopLabel,
    useGetRevenueTopRelease,
    useGetRevenueTopTenant,
    useGetRevenueTopTrack,
    useGetRevenueTopChannel,
} from '../../hooks/use-get-revenue-data';
import { RevenueDspItem } from '../../types';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailLabelAnalyticsModal from '../detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailTenantAnalyticsModal from '../detail-tenant/detail-tenant-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import DetailChannelAnalyticsModal from '../detail-channel/detail-channel-analytics-modal';
import DetailDspAnalyticsModal from '../detail-dsp/detail-dsp-analytics-modal';
import { useRevenueRankingColumns } from './use-revenue-ranking-columns';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueRankings({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const topN = 5;
    const [detailModal, setDetailModal] = useState<{
        type:
            | 'artist'
            | 'track'
            | 'release'
            | 'label'
            | 'tenant'
            | 'channel'
            | 'dsp'
            | null;
        title: string;
        id: string;
        dspReportId?: string;
    }>({
        type: null,
        title: '',
        id: '',
        dspReportId: '',
    });

    const {
        artistColumns,
        trackColumns,
        releaseColumns,
        dspColumns,
        tenantColumns,
        labelColumns,
        channelColumns,
    } = useRevenueRankingColumns({ setDetailModal });

    const topRankingTitle = (title: string) =>
        messages('analytics2.topRankingTitle', {
            count: topN,
            title,
        });

    const { topArtistData, isFetching: isArtistsLoading } =
        useGetRevenueTopArtist({
            fromDate,
            toDate,
            topN,
            includeOther: false,
        });

    const { topTrackData, isFetching: isTracksLoading } = useGetRevenueTopTrack(
        {
            fromDate,
            toDate,
            topN,
            includeOther: false,
        }
    );

    const { topReleaseData, isFetching: isReleasesLoading } =
        useGetRevenueTopRelease({
            fromDate,
            toDate,
            topN,
            includeOther: false,
        });

    const { topDspData, isFetching: isDspLoading } = useGetRevenueTopDsp({
        fromDate,
        toDate,
        topN,
        includeOther: false,
    });

    const { topTenantData, isFetching: isTenantsLoading } =
        useGetRevenueTopTenant({
            fromDate,
            toDate,
            topN,
            includeOther: false,
        });

    const { topLabelData, isFetching: isLabelsLoading } = useGetRevenueTopLabel(
        {
            fromDate,
            toDate,
            topN,
            includeOther: false,
        }
    );

    const { topChannelData, isFetching: isChannelsLoading } =
        useGetRevenueTopChannel({
            fromDate,
            toDate,
            topN,
            includeOther: false,
        });

    const dspDataWithRank = useMemo(() => {
        return topDspData?.items?.map(
            (item: RevenueDspItem, index: number) => ({
                ...item,
                rank: index + 1,
            })
        );
    }, [topDspData]);

    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.releases'))}
                        columns={releaseColumns}
                        dataSource={topReleaseData?.items}
                        loading={isReleasesLoading}
                        rowKey="releaseId"
                        labelKey="title"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_RELEASES}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.tracks'))}
                        columns={trackColumns}
                        dataSource={topTrackData?.items}
                        loading={isTracksLoading}
                        rowKey="isrc"
                        labelKey="title"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_TRACKS}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('artist.artists'))}
                        columns={artistColumns}
                        dataSource={topArtistData?.items}
                        loading={isArtistsLoading}
                        rowKey="artistId"
                        labelKey="artistName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_ARTISTS}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.labels'))}
                        columns={labelColumns}
                        dataSource={topLabelData?.items}
                        loading={isLabelsLoading}
                        rowKey="labelId"
                        labelKey="labelName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_LABELS}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('tenant.workspaces'))}
                        columns={tenantColumns}
                        dataSource={topTenantData?.items}
                        loading={isTenantsLoading}
                        rowKey="tenantId"
                        labelKey="tenantName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_TENANTS}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.dsps'))}
                        columns={dspColumns}
                        dataSource={dspDataWithRank}
                        loading={isDspLoading}
                        rowKey="dspName"
                        labelKey="dspName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_DSPS}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.channel'))}
                        columns={channelColumns}
                        dataSource={topChannelData?.items}
                        loading={isChannelsLoading}
                        rowKey="channelId"
                        labelKey="channelName"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_CHANNELS}?startDate=${fromDate}&endDate=${toDate}&type=revenue`}
                    />
                </Col>
            </Row>
            <DetailArtistAnalyticsModal
                open={detailModal.type === 'artist'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                artistId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailTrackAnalyticsModal
                open={detailModal.type === 'track'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                isrc={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailReleaseAnalyticsModal
                open={detailModal.type === 'release'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                releaseId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailLabelAnalyticsModal
                open={detailModal.type === 'label'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                labelId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailTenantAnalyticsModal
                open={detailModal.type === 'tenant'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                tenantId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailChannelAnalyticsModal
                open={detailModal.type === 'channel'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                channelId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailDspAnalyticsModal
                open={detailModal.type === 'dsp'}
                onClose={() =>
                    setDetailModal((prev) => ({
                        ...prev,
                        type: null,
                    }))
                }
                title={detailModal.title}
                pgDspId={detailModal.id}
                dspReportId={detailModal.dspReportId || ''}
                fromDate={fromDate}
                toDate={toDate}
            />
        </>
    );
}
