'use client';

import { usePermission } from '@/hooks/use-permission';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useAdvancedModeModal } from '../../hooks/use-advanced-mode-modal';
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
import AdvancedModeModal from '../modal/advanced-mode';
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
    const { isAdmin } = usePermission();
    const messages = useTranslations();
    const topN = 5;
    const {
        openAdvancedMode,
        isOpen: isAdvancedModeOpen,
        closeAdvancedMode,
    } = useAdvancedModeModal();
    const topRankingTitle = (title: string) =>
        messages('analytics2.topRankingTitle', {
            count: topN,
            title,
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
    } = useAnalyticsRankingColumns({ fromDate, toDate });
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
                                dataSource={trackRankingData?.items}
                                loading={isTracksFetching}
                                rowKey="isrc"
                                labelKey="title"
                                valueKey="totalViews"
                                defaultView={RankingCardView.LIST}
                                // viewMoreHref={createViewMoreHref(
                                //     APP_ROUTES.ANALYTICS_TRACKS,
                                //     {
                                //         fromDate,
                                //         toDate,
                                //         type: ANALYTICS_VIEW_TYPE.VIEW,
                                //         releaseType,
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
                        dataSource={artistRankingData?.items}
                        loading={isArtistsFetching}
                        rowKey="artistId"
                        labelKey="artistName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_ARTISTS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.VIEW,
                        //         releaseType,
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
                        dataSource={labelRankingData?.items}
                        loading={isLabelsFetching}
                        rowKey="labelId"
                        labelKey="labelName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_LABELS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.VIEW,
                        //         releaseType,
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
                        dataSource={tenantRankingData?.items}
                        loading={isTenantsFetching}
                        rowKey="tenantId"
                        labelKey="tenantName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_TENANTS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.VIEW,
                        //         releaseType,
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
                        title={topRankingTitle(messages('dsp.label'))}
                        columns={dspColumns}
                        dataSource={dspRankingData?.items}
                        loading={isDspsFetching}
                        rowKey="dspName"
                        labelKey="dspName"
                        valueKey="totalViews"
                        defaultView={RankingCardView.LIST}
                        // viewMoreHref={createViewMoreHref(
                        //     APP_ROUTES.ANALYTICS_DSPS,
                        //     {
                        //         fromDate,
                        //         toDate,
                        //         type: ANALYTICS_VIEW_TYPE.VIEW,
                        //         releaseType,
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
                            // viewMoreHref={createViewMoreHref(
                            //     APP_ROUTES.ANALYTICS_CHANNELS,
                            //     {
                            //         fromDate,
                            //         toDate,
                            //         type: ANALYTICS_VIEW_TYPE.VIEW,
                            //         releaseType,
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
                )}
                {isAdmin && (
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
                            // viewMoreHref={createViewMoreHref(
                            //     APP_ROUTES.ANALYTICS_SOURCE_TYPES,
                            //     {
                            //         fromDate,
                            //         toDate,
                            //         type: ANALYTICS_VIEW_TYPE.VIEW,
                            //         releaseType,
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
                )}
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
                            // viewMoreHref={createViewMoreHref(
                            //     APP_ROUTES.ANALYTICS_VIDEO_RELEASES,
                            //     {
                            //         fromDate,
                            //         toDate,
                            //         type: ANALYTICS_VIEW_TYPE.VIEW,
                            //         releaseType,
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

            {isAdvancedModeOpen && (
                <AdvancedModeModal
                    open
                    onCancel={closeAdvancedMode}
                    releaseType={releaseType}
                />
            )}
        </div>
    );
}
