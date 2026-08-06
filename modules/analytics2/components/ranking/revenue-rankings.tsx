'use client';

import { APP_ROUTES } from '@/enums/routes';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { ANALYTICS_MODAL_TYPE } from '../../enums/modal-type';
import { ANALYTICS_VIEW_TYPE } from '../../enums/tabs';
import { createViewMoreHref } from '../../helpers';
import { useAdvancedModeModal } from '../../hooks/use-advanced-mode-modal';
import {
    useGetRevenueTopArtist,
    useGetRevenueTopChannel,
    useGetRevenueTopDsp,
    useGetRevenueTopLabel,
    useGetRevenueTopRelease,
    useGetRevenueTopReleaseVideo,
    useGetRevenueTopSourceType,
    useGetRevenueTopTenant,
    useGetRevenueTopTrack,
} from '../../hooks/use-get-revenue-data';
import { RevenueDspItem } from '../../types';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import DetailArtistAnalyticsModal from '../detail-artist/detail-artist-analytics-modal';
import DetailChannelAnalyticsModal from '../detail-channel/detail-channel-analytics-modal';
import DetailDspAnalyticsModal from '../detail-dsp/detail-dsp-analytics-modal';
import DetailLabelAnalyticsModal from '../detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailSourceTypeAnalyticsModal from '../detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '../detail-tenant/detail-tenant-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import AdvancedModeModal from '../modal/advanced-mode';
import { useRevenueRankingColumns } from './use-revenue-ranking-columns';

interface Props {
    fromDate: string;
    toDate: string;
    releaseType: ANALYTICS_RELEASE_TYPE;
    sortBy?: string;
}

export default function RevenueRankings({
    fromDate,
    toDate,
    releaseType,
    sortBy,
}: Props) {
    const messages = useTranslations();
    const topN = 5;
    const {
        openAdvancedMode,
        isOpen: isAdvancedModeOpen,
        closeAdvancedMode,
    } = useAdvancedModeModal();
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
        artistColumns,
        trackColumns,
        releaseColumns,
        releaseVideoColumns,
        dspColumns,
        tenantColumns,
        labelColumns,
        channelColumns,
        sourceTypeColumns,
    } = useRevenueRankingColumns({ setDetailModal, fromDate, toDate });

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
            releaseType,
            sortBy,
        });

    const { topTrackData, isFetching: isTracksLoading } = useGetRevenueTopTrack(
        {
            fromDate,
            toDate,
            topN,
            includeOther: false,
            releaseType,
            sortBy,
        },
        {
            enabled: releaseType !== ANALYTICS_RELEASE_TYPE.VIDEO,
        }
    );

    const { topReleaseData, isFetching: isReleasesLoading } =
        useGetRevenueTopRelease(
            {
                fromDate,
                toDate,
                topN,
                includeOther: false,
                releaseType,
                sortBy,
            },
            {
                enabled: releaseType !== ANALYTICS_RELEASE_TYPE.VIDEO,
            }
        );

    const { topReleaseVideoData, isFetching: isReleaseVideoLoading } =
        useGetRevenueTopReleaseVideo(
            {
                fromDate,
                toDate,
                topN,
                includeOther: false,
                releaseType,
                sortBy,
            },
            {
                enabled: releaseType !== ANALYTICS_RELEASE_TYPE.AUDIO,
            }
        );

    const { topDspData, isFetching: isDspLoading } = useGetRevenueTopDsp({
        fromDate,
        toDate,
        topN,
        includeOther: false,
        releaseType,
        sortBy,
    });

    const { topTenantData, isFetching: isTenantsLoading } =
        useGetRevenueTopTenant({
            fromDate,
            toDate,
            topN,
            includeOther: false,
            releaseType,
            sortBy,
        });

    const { topLabelData, isFetching: isLabelsLoading } = useGetRevenueTopLabel(
        {
            fromDate,
            toDate,
            topN,
            includeOther: false,
            releaseType,
            sortBy,
        }
    );

    const { topChannelData, isFetching: isChannelsLoading } =
        useGetRevenueTopChannel({
            fromDate,
            toDate,
            topN,
            includeOther: false,
            releaseType,
            sortBy,
        });

    const { topSourceTypeData, isFetching: isSourceTypesLoading } =
        useGetRevenueTopSourceType({
            fromDate,
            toDate,
            topN,
            includeOther: false,
            releaseType,
            sortBy,
        });

    const dspDataWithRank = useMemo(() => {
        return topDspData?.items?.map(
            (item: RevenueDspItem, index: number) => ({
                ...item,
                rank: index + 1,
            })
        );
    }, [topDspData]);

    const sourceTypeDataWithRank = useMemo(() => {
        return topSourceTypeData?.items?.map((item: any, index: number) => ({
            ...item,
            rank: index + 1,
        }));
    }, [topSourceTypeData]);

    return (
        <>
            <Row gutter={[24, 24]}>
                {releaseType !== ANALYTICS_RELEASE_TYPE.VIDEO && (
                    <>
                        <Col span={12} xs={24} lg={12}>
                            <RankingCard
                                title={topRankingTitle(
                                    messages('common.releases')
                                )}
                                columns={releaseColumns}
                                dataSource={topReleaseData?.items}
                                loading={isReleasesLoading}
                                rowKey="releaseId"
                                labelKey="title"
                                valueKey="revenueUsd"
                                defaultView={RankingCardView.LIST}
                                // viewMoreHref={createViewMoreHref(
                                //     APP_ROUTES.ANALYTICS_RELEASES,
                                //     {
                                //         fromDate,
                                //         toDate,
                                //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                                //         releaseType,
                                //         sortBy,
                                //     }
                                // )}
                                onViewMore={() =>
                                    openAdvancedMode({
                                        fromDate,
                                        toDate,
                                        entityType:
                                            ANALYTICS_ENTITY_TYPE.RELEASE,
                                    })
                                }
                            />
                        </Col>
                        <Col span={12} xs={24} lg={12}>
                            <RankingCard
                                title={topRankingTitle(
                                    messages('common.tracks')
                                )}
                                columns={trackColumns}
                                dataSource={topTrackData?.items}
                                loading={isTracksLoading}
                                rowKey="isrc"
                                labelKey="title"
                                valueKey="revenueUsd"
                                defaultView={RankingCardView.LIST}
                                // viewMoreHref={createViewMoreHref(
                                //     APP_ROUTES.ANALYTICS_TRACKS,
                                //     {
                                //         fromDate,
                                //         toDate,
                                //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                                //         releaseType,
                                //         sortBy,
                                //     }
                                // )}
                                onViewMore={() =>
                                    openAdvancedMode({
                                        fromDate,
                                        toDate,
                                        entityType: ANALYTICS_ENTITY_TYPE.TRACK,
                                    })
                                }
                            />
                        </Col>
                    </>
                )}

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
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_ARTISTS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                        //         releaseType,
                        //         sortBy,
                        //     }
                        // )}
                        onViewMore={() =>
                            openAdvancedMode({
                                fromDate,
                                toDate,
                                entityType: ANALYTICS_ENTITY_TYPE.ARTIST,
                            })
                        }
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
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_LABELS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                        //         releaseType,
                        //         sortBy,
                        //     }
                        // )}
                        onViewMore={() =>
                            openAdvancedMode({
                                fromDate,
                                toDate,
                                entityType: ANALYTICS_ENTITY_TYPE.LABEL,
                            })
                        }
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
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_TENANTS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                        //         releaseType,
                        //         sortBy,
                        //     }
                        // )}
                        onViewMore={() =>
                            openAdvancedMode({
                                fromDate,
                                toDate,
                                entityType: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                            })
                        }
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
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_DSPS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                        //         releaseType,
                        //         sortBy,
                        //     }
                        // )}
                        onViewMore={() =>
                            openAdvancedMode({
                                fromDate,
                                toDate,
                                entityType: ANALYTICS_ENTITY_TYPE.DSP,
                            })
                        }
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
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_CHANNELS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                        //         releaseType,
                        //         sortBy,
                        //     }
                        // )}
                        onViewMore={() =>
                            openAdvancedMode({
                                fromDate,
                                toDate,
                                entityType: ANALYTICS_ENTITY_TYPE.CHANNEL,
                            })
                        }
                    />
                </Col>
                <Col span={12} xs={24} lg={12}>
                    <RankingCard
                        title={topRankingTitle(
                            messages('analytics2.distributors')
                        )}
                        columns={sourceTypeColumns}
                        dataSource={sourceTypeDataWithRank}
                        loading={isSourceTypesLoading}
                        rowKey="sourceType"
                        labelKey="sourceTypeLabel"
                        valueKey="revenueUsd"
                        defaultView={RankingCardView.LIST}
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_SOURCE_TYPES,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                        //         releaseType,
                        //         sortBy,
                        //     }
                        // )}
                        onViewMore={() =>
                            openAdvancedMode({
                                fromDate,
                                toDate,
                                entityType: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                            })
                        }
                    />
                </Col>
                {releaseType !== ANALYTICS_RELEASE_TYPE.AUDIO && (
                    <Col span={12} xs={24} lg={12}>
                        <RankingCard
                            title={topRankingTitle(
                                messages('common.releasesVideo')
                            )}
                            columns={releaseVideoColumns}
                            dataSource={topReleaseVideoData?.items}
                            loading={isReleaseVideoLoading}
                            rowKey="releaseId"
                            labelKey="title"
                            valueKey="revenueUsd"
                            defaultView={RankingCardView.LIST}
                            // viewMoreHref={createViewMoreHref(
                            //     APP_ROUTES.ANALYTICS_VIDEO_RELEASES,
                            //     {
                            //         fromDate,
                            //         toDate,
                            //         type: ANALYTICS_VIEW_TYPE.REVENUE,
                            //         releaseType,
                            //         sortBy,
                            //     }
                            // )}
                            onViewMore={() =>
                                openAdvancedMode({
                                    fromDate,
                                    toDate,
                                    entityType:
                                        ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO,
                                })
                            }
                        />
                    </Col>
                )}
            </Row>
            {detailModal.type === ANALYTICS_MODAL_TYPE.ARTIST && (
                <DetailArtistAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.ARTIST}
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
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.TRACK && (
                <DetailTrackAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.TRACK}
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
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.RELEASE && (
                <DetailReleaseAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.RELEASE}
                    onClose={() =>
                        setDetailModal((prev) => ({
                            ...prev,
                            type: null,
                        }))
                    }
                    title={detailModal.title}
                    releaseId={detailModal.id}
                    upc={detailModal.upc}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.LABEL && (
                <DetailLabelAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.LABEL}
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
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.TENANT && (
                <DetailTenantAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.TENANT}
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
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.CHANNEL && (
                <DetailChannelAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.CHANNEL}
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
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.DSP && (
                <DetailDspAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.DSP}
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
                    releaseType={releaseType}
                />
            )}
            {detailModal.type === ANALYTICS_MODAL_TYPE.SOURCE_TYPE && (
                <DetailSourceTypeAnalyticsModal
                    open={detailModal.type === ANALYTICS_MODAL_TYPE.SOURCE_TYPE}
                    onClose={() =>
                        setDetailModal((prev) => ({
                            ...prev,
                            type: null,
                        }))
                    }
                    title={detailModal.title}
                    sourceType={detailModal.id}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
                />
            )}
            {isAdvancedModeOpen && (
                <AdvancedModeModal
                    open
                    onCancel={closeAdvancedMode}
                    releaseType={releaseType}
                />
            )}
        </>
    );
}
