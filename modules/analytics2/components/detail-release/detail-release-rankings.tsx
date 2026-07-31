'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Avatar, Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ANALYTICS_RELEASE_TYPE } from '../../enums';
import RankingCard, { RankingCardView } from '../card/ranking-card';

interface DetailReleaseRankingsProps {
    releaseId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
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

export default function DetailReleaseRankings({
    releaseId,
    releaseType,
    enabled = true,
}: DetailReleaseRankingsProps) {
    const messages = useTranslations();

    // Gọi API lấy thông tin chi tiết của Release để lấy metadata external
    const { releaseData, isFetching: isDetailFetching } = useGetDetailRelease(
        releaseId,
        { enabled }
    );

    const { dspData: listDspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
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
                title: messages('track.externalId'),
                dataIndex: 'albumId',
                key: 'albumId',
                ellipsis: true,
                render: (text: string) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('track.albumUrl'),
                dataIndex: 'albumUrl',
                key: 'albumUrl',
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
        if (!releaseData?.metadataExternal) return [];
        return Object.entries(releaseData.metadataExternal)
            .filter(([_, value]) => !!value)
            .map(([platform, value]) => ({
                platform,
                albumId: value?.albumId,
                albumUrl: value?.albumUrl,
                coverUrl: value?.coverImages?.[0]?.url,
            }));
    }, [releaseData]);

    const videoMetadataColumns = useMemo(
        () => [
            {
                title: messages('track.dsp'),
                dataIndex: 'platform',
                key: 'platform',
                width: 150,
                render: () => (
                    <div className="flex items-center gap-2">
                        <span className="capitalize text-gray-900 dark:text-zinc-100">
                            YouTube
                        </span>
                    </div>
                ),
            },
            {
                title: 'Video',
                dataIndex: 'title',
                key: 'title',
                ellipsis: true,
                render: (title: string, record: any) =>
                    record.externalId ? (
                        <CustomTooltip title={messages('common.viewOnYoutube')}>
                            <a
                                href={`https://www.youtube.com/watch?v=${record.externalId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="!text-blue-500 hover:!text-blue-600 hover:underline"
                            >
                                {title || record.externalId}
                            </a>
                        </CustomTooltip>
                    ) : (
                        title || '—'
                    ),
            },
            {
                title: messages('common.channel'),
                dataIndex: 'channelName',
                key: 'channelName',
                ellipsis: true,
                render: (channelName: string, record: any) =>
                    record.video?.channelId ? (
                        <CustomTooltip title={messages('common.viewOnYoutube')}>
                            <a
                                href={`https://www.youtube.com/channel/${record.video?.channelId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="!text-blue-500 hover:!text-blue-600 hover:underline"
                            >
                                {channelName}
                            </a>
                        </CustomTooltip>
                    ) : (
                        channelName || '—'
                    ),
            },
        ],
        [messages]
    );

    const mappedVideoData = useMemo(() => {
        if (!releaseData?.video) return [];
        return [
            {
                id: releaseData.video.id || 'youtube-video',
                platform: 'youtube',
                title: releaseData.video.title || releaseData.title,
                externalId: releaseData.video.externalId,
                channelName: releaseData.video.channel?.name || '—',
                video: {
                    channelId: releaseData.video.channelId,
                },
            },
        ];
    }, [releaseData]);

    const isAudio = useMemo(() => {
        return (
            releaseData?.type === RELEASE_TYPE.AUDIO ||
            releaseType === ANALYTICS_RELEASE_TYPE.AUDIO
        );
    }, [releaseData?.type, releaseType]);

    if (!isAudio && !releaseData?.video) {
        return null;
    }

    return (
        <div className="space-y-6">
            <Row gutter={[24, 24]}>
                {isAudio && (
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('release.overview.onlineLinks')}
                            columns={metadataColumns}
                            dataSource={mappedMetadataExternalData}
                            loading={isDetailFetching}
                            rowKey="platform"
                            labelKey="platform"
                            valueKey="albumId"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                )}

                {!isAudio && releaseData?.video && (
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('release.overview.videoInfo')}
                            columns={videoMetadataColumns}
                            dataSource={mappedVideoData}
                            loading={isDetailFetching}
                            rowKey="id"
                            labelKey="platform"
                            valueKey="title"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                )}
            </Row>
        </div>
    );
}
