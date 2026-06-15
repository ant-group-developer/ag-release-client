'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
    useGetArtistRanking,
    useGetDspRanking,
    useGetLabelRanking,
    useGetReleaseRanking,
    useGetTenantRanking,
    useGetTrackRanking,
} from '../../hooks/use-get-rankings';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailLabelAnalyticsModal from '../detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import { useAnalyticsRankingColumns } from './use-analytics-ranking-columns';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function AnalyticsRankings({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const topN = 5;
    const topRankingTitle = (title: string) =>
        messages('analytics2.topRankingTitle', {
            count: topN,
            title,
        });
    const [detailModal, setDetailModal] = useState<{
        type: 'release' | 'track' | 'label' | 'artist' | null;
        title: string;
        id: string;
    }>({
        type: null,
        title: '',
        id: '',
    });

    const {
        trackColumns,
        releaseColumns,
        artistColumns,
        labelColumns,
        tenantColumns,
        dspColumns,
    } = useAnalyticsRankingColumns({ setDetailModal });
    // Fetch live ranking data
    const { trackRankingData, isFetching: isTracksFetching } =
        useGetTrackRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { releaseRankingData, isFetching: isReleasesFetching } =
        useGetReleaseRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { artistRankingData, isFetching: isArtistsFetching } =
        useGetArtistRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { labelRankingData, isFetching: isLabelsFetching } =
        useGetLabelRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { tenantRankingData, isFetching: isTenantsFetching } =
        useGetTenantRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { dspRankingData, isFetching: isDspsFetching } = useGetDspRanking({
        fromDate,
        toDate,
        page: 1,
        pageSize: topN,
    });

    return (
        <div className="flex flex-col gap-6">
            <Row gutter={[24, 24]}>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.tracks'))}
                        columns={trackColumns}
                        dataSource={trackRankingData?.items}
                        loading={isTracksFetching}
                        rowKey="isrc"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS2_TRACKS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.releases'))}
                        columns={releaseColumns}
                        dataSource={releaseRankingData?.items}
                        loading={isReleasesFetching}
                        rowKey="releaseId"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS2_RELEASES}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('artist.artists'))}
                        columns={artistColumns}
                        dataSource={artistRankingData?.items}
                        loading={isArtistsFetching}
                        rowKey="artistId"
                        labelKey="artistName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS2_ARTISTS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.labels'))}
                        columns={labelColumns}
                        dataSource={labelRankingData?.items}
                        loading={isLabelsFetching}
                        rowKey="labelId"
                        labelKey="labelName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS2_LABELS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('tenant.workspaces'))}
                        columns={tenantColumns}
                        dataSource={tenantRankingData?.items}
                        loading={isTenantsFetching}
                        rowKey="tenantId"
                        labelKey="tenantName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS2_TENANTS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.dsps'))}
                        columns={dspColumns}
                        dataSource={dspRankingData?.items}
                        loading={isDspsFetching}
                        rowKey="dspName"
                        labelKey="dspName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS2_DSPS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
            </Row>
            <DetailReleaseAnalyticsModal
                open={detailModal.type === 'release'}
                onClose={() =>
                    setDetailModal((prev) => ({ ...prev, type: null }))
                }
                title={detailModal.title}
                releaseId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailTrackAnalyticsModal
                open={detailModal.type === 'track'}
                onClose={() =>
                    setDetailModal((prev) => ({ ...prev, type: null }))
                }
                title={detailModal.title}
                isrc={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailLabelAnalyticsModal
                open={detailModal.type === 'label'}
                onClose={() =>
                    setDetailModal((prev) => ({ ...prev, type: null }))
                }
                title={detailModal.title}
                labelId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
            <DetailArtistAnalyticsModal
                open={detailModal.type === 'artist'}
                onClose={() =>
                    setDetailModal((prev) => ({ ...prev, type: null }))
                }
                title={detailModal.title}
                artistId={detailModal.id}
                fromDate={fromDate}
                toDate={toDate}
            />
        </div>
    );
}
