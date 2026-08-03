'use client';

import { APP_ROUTES } from '@/enums/routes';
import useModalStore from '@/hooks/use-modal';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ANALYTICS_RELEASE_TYPE } from '../../enums';
import { ANALYTICS_MODAL_TYPE } from '../../enums/modal-type';
import { ANALYTICS_VIEW_TYPE } from '../../enums/tabs';
import { createViewMoreHref } from '../../helpers';
import {
    useGetArtistRanking,
    useGetChannelRanking,
    useGetDspRanking,
    useGetLabelRanking,
    useGetReleaseRanking,
    useGetReleaseVideoRanking,
    useGetSourceTypeRanking,
    useGetTenantRanking,
    useGetTrackRanking,
} from '../../hooks/use-get-rankings';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailChannelAnalyticsModal from '../detail-channel/detail-channel-analytics-modal';
import DetailDspAnalyticsModal from '../detail-dsp/detail-dsp-analytics-modal';
import DetailLabelAnalyticsModal from '../detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailSourceTypeAnalyticsModal from '../detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '../detail-tenant/detail-tenant-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import { useAnalyticsRankingColumns } from './use-analytics-ranking-columns';

interface Props {
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function AnalyticsRankings({
    fromDate,
    toDate,
    releaseType,
}: Props) {
    const messages = useTranslations();
    const topN = 5;
    const openModal = useModalStore((state) => state.openModal);
    const topRankingTitle = (title: string) =>
        messages('analytics2.topRankingTitle', {
            count: topN,
            title,
        });
    const [detailModal, setDetailModal] = useState<{
        type: ANALYTICS_MODAL_TYPE | null;
        title: string;
        id: string;
        upc?: string;
        dspReportId?: string;
    }>({
        type: null,
        title: '',
        id: '',
        upc: '',
        dspReportId: '',
    });

    const {
        trackColumns,
        releaseColumns,
        releaseVideoColumns,
        artistColumns,
        labelColumns,
        tenantColumns,
        dspColumns,
        channelColumns,
        sourceTypeColumns,
    } = useAnalyticsRankingColumns({ setDetailModal });
    // Fetch live ranking data
    const { trackRankingData, isFetching: isTracksFetching } =
        useGetTrackRanking(
            {
                fromDate,
                toDate,
                page: 1,
                pageSize: topN,
                releaseType,
            },
            {
                enabled: releaseType !== ANALYTICS_RELEASE_TYPE.VIDEO,
            }
        );

    const { releaseRankingData, isFetching: isReleasesFetching } =
        useGetReleaseRanking(
            {
                fromDate,
                toDate,
                page: 1,
                pageSize: topN,
                releaseType,
            },
            {
                enabled: releaseType !== ANALYTICS_RELEASE_TYPE.VIDEO,
            }
        );

    const { releaseVideoRankingData, isFetching: isReleaseVideoFetching } =
        useGetReleaseVideoRanking(
            {
                fromDate,
                toDate,
                page: 1,
                pageSize: topN,
                releaseType,
            },
            {
                enabled: releaseType !== ANALYTICS_RELEASE_TYPE.AUDIO,
            }
        );

    const { artistRankingData, isFetching: isArtistsFetching } =
        useGetArtistRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
            releaseType,
        });

    const { labelRankingData, isFetching: isLabelsFetching } =
        useGetLabelRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
            releaseType,
        });

    const { tenantRankingData, isFetching: isTenantsFetching } =
        useGetTenantRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
            releaseType,
        });

    const { dspRankingData, isFetching: isDspsFetching } = useGetDspRanking({
        fromDate,
        toDate,
        page: 1,
        pageSize: topN,
        releaseType,
    });

    const { channelRankingData, isFetching: isChannelsFetching } =
        useGetChannelRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
            releaseType,
        });

    const { sourceTypeRankingData, isFetching: isSourceTypesFetching } =
        useGetSourceTypeRanking({
            fromDate,
            toDate,
            page: 1,
            pageSize: topN,
            releaseType,
        });

    return (
        <div className="flex flex-col gap-6">
            <Row gutter={[24, 24]}>
                {releaseType !== ANALYTICS_RELEASE_TYPE.VIDEO && (
                    <>
                        <Col span={12} xs={24} lg={12}>
                            <RankingCard
                                title={topRankingTitle(
                                    messages('common.releases')
                                )}
                                columns={releaseColumns}
                                dataSource={releaseRankingData?.items}
                                loading={isReleasesFetching}
                                rowKey="releaseId"
                                labelKey="title"
                                valueKey="totalViews"
                                defaultView={RankingCardView.LIST}
                                // viewMoreHref={createViewMoreHref(
                                //     APP_ROUTES.ANALYTICS_RELEASES,
                                //     {
                                //         fromDate,
                                //         toDate,
                                //         type: ANALYTICS_VIEW_TYPE.VIEW,
                                //         releaseType,
                                //     }
                                // )}
                                onViewMore={() =>
                                    openModal(
                                        ANALYTICS_MODAL_TYPE.ADVANCED_MODE,
                                        {
                                            fromDate,
                                            toDate,
                                            type: ANALYTICS_MODAL_TYPE.RELEASE,
                                        }
                                    )
                                }
                            />
                        </Col>
                        <Col span={12} xs={24} lg={12}>
                            <RankingCard
                                title={topRankingTitle(
                                    messages('common.tracks')
                                )}
                                columns={trackColumns}
                                dataSource={trackRankingData?.items}
                                loading={isTracksFetching}
                                rowKey="isrc"
                                labelKey="title"
                                valueKey="totalViews"
                                defaultView={RankingCardView.LIST}
                                viewMoreHref={createViewMoreHref(
                                    APP_ROUTES.ANALYTICS_TRACKS,
                                    {
                                        fromDate,
                                        toDate,
                                        type: ANALYTICS_VIEW_TYPE.VIEW,
                                        releaseType,
                                    }
                                )}
                            />
                        </Col>
                    </>
                )}

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
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_ARTISTS,
                            {
                                fromDate,
                                toDate,
                                type: ANALYTICS_VIEW_TYPE.VIEW,
                                releaseType,
                            }
                        )}
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
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_LABELS,
                            {
                                fromDate,
                                toDate,
                                type: ANALYTICS_VIEW_TYPE.VIEW,
                                releaseType,
                            }
                        )}
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
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_TENANTS,
                            {
                                fromDate,
                                toDate,
                                type: ANALYTICS_VIEW_TYPE.VIEW,
                                releaseType,
                            }
                        )}
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
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_DSPS,
                            {
                                fromDate,
                                toDate,
                                type: ANALYTICS_VIEW_TYPE.VIEW,
                                releaseType,
                            }
                        )}
                    />
                </Col>
                {releaseType !== ANALYTICS_RELEASE_TYPE.AUDIO && (
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
                            viewMoreHref={createViewMoreHref(
                                APP_ROUTES.ANALYTICS_CHANNELS,
                                {
                                    fromDate,
                                    toDate,
                                    type: ANALYTICS_VIEW_TYPE.VIEW,
                                    releaseType,
                                }
                            )}
                        />
                    </Col>
                )}
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(
                            messages('analytics2.distributors')
                        )}
                        columns={sourceTypeColumns}
                        dataSource={sourceTypeRankingData?.items}
                        loading={isSourceTypesFetching}
                        rowKey="sourceType"
                        labelKey="sourceTypeLabel"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        viewMoreHref={createViewMoreHref(
                            APP_ROUTES.ANALYTICS_SOURCE_TYPES,
                            {
                                fromDate,
                                toDate,
                                type: ANALYTICS_VIEW_TYPE.VIEW,
                                releaseType,
                            }
                        )}
                    />
                </Col>
                {releaseType !== ANALYTICS_RELEASE_TYPE.AUDIO && (
                    <Col span={12} xs={24} lg={12}>
                        <RankingCard
                            title={topRankingTitle(
                                messages('common.releasesVideo')
                            )}
                            columns={releaseVideoColumns}
                            dataSource={releaseVideoRankingData?.items}
                            loading={isReleaseVideoFetching}
                            rowKey="releaseId"
                            labelKey="title"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                            viewMoreHref={createViewMoreHref(
                                APP_ROUTES.ANALYTICS_VIDEO_RELEASES,
                                {
                                    fromDate,
                                    toDate,
                                    type: ANALYTICS_VIEW_TYPE.VIEW,
                                    releaseType,
                                }
                            )}
                        />
                    </Col>
                )}
            </Row>
            {detailModal.type === ANALYTICS_MODAL_TYPE.RELEASE && (
                <DetailReleaseAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.RELEASE}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, type: null }))
                    }
                    title={detailModal.title}
                    releaseId={detailModal.id}
                    upc={detailModal.upc}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
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
                    releaseType={releaseType}
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
                    releaseType={releaseType}
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
                    releaseType={releaseType}
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
                    releaseType={releaseType}
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
                    releaseType={releaseType}
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
                    releaseType={releaseType}
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
                    releaseType={releaseType}
                />
            )}
        </div>
    );
}
