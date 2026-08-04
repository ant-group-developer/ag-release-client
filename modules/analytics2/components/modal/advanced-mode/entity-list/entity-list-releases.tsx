'use client';

import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { useGetReleaseRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { Empty, List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { ContentItem } from '../content-entity-selector';

interface Props {
    fromDate?: string;
    toDate?: string;
    keyword?: string;
    onSelect: (item: ContentItem) => void;
}

export default function EntityListReleases({
    fromDate = dayjs().subtract(27, 'day').format('YYYY-MM-DD'),
    toDate = dayjs().format('YYYY-MM-DD'),
    keyword,
    onSelect,
}: Props) {
    const { releaseRankingData, isFetching } = useGetReleaseRanking({
        fromDate,
        toDate,
        page: 1,
        pageSize: 15,
        keyword,
    });

    if (isFetching && !releaseRankingData?.items?.length) {
        return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;
    }

    const items = releaseRankingData?.items || [];

    if (!items.length) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;
    }

    return (
        <List
            dataSource={items}
            renderItem={(item) => {
                const coverUrl = item.release?.coverArtThumbnails?.[
                    RELEASE_COVER_ART_SIZE.S75
                ] as string;

                return (
                    <List.Item
                        onClick={() =>
                            onSelect({
                                id: item.releaseId,
                                title: item.title,
                                type: 'Release',
                                thumbnailUrl: coverUrl,
                                subtitle: item.upc
                                    ? `UPC: ${item.upc}`
                                    : undefined,
                            })
                        }
                        className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <div className="flex w-full items-center justify-between gap-3 px-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <ReleaseCoverImage
                                    width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                                    height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                                    fileId={coverUrl}
                                />
                                <div className="flex flex-col overflow-hidden">
                                    <Typography.Text
                                        ellipsis={{ tooltip: item.title }}
                                        className="text-sm font-medium"
                                    >
                                        {item.title}
                                    </Typography.Text>
                                    <Typography.Text
                                        type="secondary"
                                        className="text-xs"
                                    >
                                        {item.upc
                                            ? `UPC: ${item.upc}`
                                            : 'Release'}
                                    </Typography.Text>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
}
