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
    useGetChannelRanking,
    useGetSourceTypeRanking,
} from '../../hooks/use-get-rankings';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailLabelAnalyticsModal from '../detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailTenantAnalyticsModal from '../detail-tenant/detail-tenant-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import DetailChannelAnalyticsModal from '../detail-channel/detail-channel-analytics-modal';
import DetailDspAnalyticsModal from '../detail-dsp/detail-dsp-analytics-modal';
import DetailSourceTypeAnalyticsModal from '../detail-source-type/detail-source-type-analytics-modal';
import { ANALYTICS_MODAL_TYPE } from '../../enums/modal-type';
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
        type: ANALYTICS_MODAL_TYPE | null;
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
        trackColumns,
        releaseColumns,
        artistColumns,
        labelColumns,
        tenantColumns,
        dspColumns,
        channelColumns,
        sourceTypeColumns,
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

    const { channelRankingData, isFetching: isChannelsFetching } =
        useGetChannelRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
        });

    const { sourceTypeRankingData, isFetching: isSourceTypesFetching } =
        useGetSourceTypeRanking({
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
                        title={topRankingTitle(messages('common.releases'))}
                        columns={releaseColumns}
                        dataSource={releaseRankingData?.items}
                        loading={isReleasesFetching}
                        rowKey="releaseId"
                        labelKey="title"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_RELEASES}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
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
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_TRACKS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
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
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_ARTISTS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
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
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_LABELS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
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
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_TENANTS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('dsp.label'))}
                        columns={dspColumns}
                        dataSource={dspRankingData?.items}
                        loading={isDspsFetching}
                        rowKey="dspName"
                        labelKey="dspName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_DSPS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.channel'))}
                        columns={channelColumns}
                        dataSource={channelRankingData?.items}
                        loading={isChannelsFetching}
                        rowKey="channelId"
                        labelKey="channelName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_CHANNELS}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(messages('common.sourceType'))}
                        columns={sourceTypeColumns}
                        dataSource={sourceTypeRankingData?.items}
                        loading={isSourceTypesFetching}
                        rowKey="sourceType"
                        labelKey="sourceTypeLabel"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={`${APP_ROUTES.ANALYTICS_SOURCE_TYPES}?startDate=${fromDate}&endDate=${toDate}&type=view`}
                    />
                </Col>
            </Row>
            {detailModal.type === ANALYTICS_MODAL_TYPE.RELEASE && (
                <DetailReleaseAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.RELEASE}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    releaseId={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.TRACK && (
                <DetailTrackAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.TRACK}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    isrc={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.LABEL && (
                <DetailLabelAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.LABEL}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    labelId={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.ARTIST && (
                <DetailArtistAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.ARTIST}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    artistId={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.TENANT && (
                <DetailTenantAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.TENANT}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    tenantId={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.CHANNEL && (
                <DetailChannelAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.CHANNEL}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    channelId={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.DSP && (
                <DetailDspAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.DSP}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    pgDspId={detailModal.id}
                    dspReportId={detailModal.dspReportId || ''}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.SOURCE_TYPE && (
                <DetailSourceTypeAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.SOURCE_TYPE}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    sourceType={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                />
            )}
        </div>
    );
}
