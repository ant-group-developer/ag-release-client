'use client';

import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { ANALYTIC_SORT_BY } from '@/enums/common';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Avatar, Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ANALYTICS_RELEASE_TYPE } from '../../enums';
import RankingCard, { RankingCardView } from '../card/ranking-card';

interface DetailTrackRankingsProps {
    isrc: string;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    sortBy?: ANALYTIC_SORT_BY;
    enabled?: boolean;
}

function normalizeMetadataKey(value?: string | null) {
    return value?.trim().toLowerCase();
}

function getDspByMetadataKey(key: string, dspData: any[]) {
    const normalizedKey = normalizeMetadataKey(key);

    return dspData.find((item) =>
        [item.code, item.codeCi, item.name].some(
            (value) => normalizeMetadataKey(value) === normalizedKey
        )
    );
}

export default function DetailTrackRankings({
    isrc,
    enabled = true,
}: DetailTrackRankingsProps) {
    const messages = useTranslations();

    // Lấy thông tin track theo ISRC
    const { tracksData, isFetching: isTrackFetching } = useGetListTracks(
        { keyword: isrc },
        { enabled }
    );
    const trackData = tracksData?.items?.[0];

    // Lấy danh sách DSP để lấy logo/picture
    const { dspData: listDspData } = useGetListDsp(
        { pageSize: PAGE_SIZE_EXTRA_LARGE },
        { enabled }
    );
    const dspItems = useMemo(
        () => listDspData?.items ?? [],
        [listDspData?.items]
    );

    const metadataColumns = useMemo(
        () => [
            {
                title: messages('track.dsp'),
                dataIndex: 'platform',
                key: 'platform',
                width: 150,
                render: (text: string) => {
                    const dsp = getDspByMetadataKey(text, dspItems);
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar src={dsp?.picture} shape="square" size={32}>
                                {text[0]?.toUpperCase()}
                            </Avatar>
                            <span className="capitalize text-gray-900 dark:text-zinc-100">
                                {text}
                            </span>
                        </div>
                    );
                },
            },
            {
                title: 'ISRC',
                dataIndex: 'trackId',
                key: 'trackId',
                ellipsis: true,
                render: (text: string) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('track.trackUrl') || 'Track URL',
                dataIndex: 'trackUrl',
                key: 'trackUrl',
                ellipsis: true,
                render: (url: string) =>
                    url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!text-purple-500 hover:!text-purple-600 hover:underline"
                        >
                            {url}
                        </a>
                    ) : (
                        '—'
                    ),
            },
        ],
        [messages, dspItems]
    );

    const mappedMetadataExternalData = useMemo(() => {
        if (!trackData?.metadataExternal) return [];
        return Object.entries(trackData.metadataExternal)
            .filter(([_, value]) => !!value)
            .map(([platform, value]: [string, any]) => ({
                platform,
                trackId: value?.trackId || value?.albumId,
                trackUrl: value?.trackUrl || value?.albumUrl,
            }));
    }, [trackData]);

    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
                <RankingCard
                    title={messages('release.overview.onlineLinks')}
                    columns={metadataColumns}
                    dataSource={mappedMetadataExternalData}
                    loading={isTrackFetching}
                    rowKey="platform"
                    labelKey="platform"
                    valueKey="trackId"
                    defaultView={RankingCardView.LIST}
                />
            </Col>
        </Row>
    );
}
