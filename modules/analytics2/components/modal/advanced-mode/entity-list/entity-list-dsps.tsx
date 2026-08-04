'use client';

import { formattedNumber } from '@/helpers/common';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { useGetDspRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Avatar, Empty, List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { Radio } from 'lucide-react';
import { ContentItem } from '../content-entity-selector';

interface Props {
    fromDate?: string;
    toDate?: string;
    keyword?: string;
    onSelect: (item: ContentItem) => void;
}

export default function EntityListDsps({
    fromDate = dayjs().subtract(27, 'day').format('YYYY-MM-DD'),
    toDate = dayjs().format('YYYY-MM-DD'),
    keyword,
    onSelect,
}: Props) {
    const { dspRankingData, isFetching } = useGetDspRanking({
        fromDate,
        toDate,
        page: 1,
        pageSize: 15,
        keyword,
    });

    if (isFetching && !dspRankingData?.items?.length) {
        return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;
    }

    const items = dspRankingData?.items || [];

    if (!items.length) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;
    }

    return (
        <List
            dataSource={items}
            renderItem={(item) => {
                const dspLogo =
                    (item as any).imageUrl ||
                    (item as any).picture ||
                    (item as any).logo ||
                    (item as any).icon;

                return (
                    <List.Item
                        onClick={() =>
                            onSelect({
                                id: item.dspName || (item as any).pgDspId,
                                title: item.dspName,
                                type: 'DSP',
                                thumbnailUrl: dspLogo || undefined,
                                subtitle: `${formattedNumber(item.totalViews)} views`,
                            })
                        }
                        className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {dspLogo ? (
                                    <ReleaseCoverImage
                                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                                        src={dspLogo}
                                    />
                                ) : (
                                    <Avatar
                                        shape="square"
                                        size={40}
                                        icon={<Radio className="h-5 w-5" />}
                                        className="shrink-0 rounded-md bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                                    >
                                        {(item.dspName || 'D')[0]?.toUpperCase()}
                                    </Avatar>
                                )}
                                <div className="flex flex-col overflow-hidden">
                                    <Typography.Text
                                        ellipsis={{ tooltip: item.dspName }}
                                        className="text-sm font-medium"
                                    >
                                        {item.dspName}
                                    </Typography.Text>
                                    <Typography.Text
                                        type="secondary"
                                        className="text-xs"
                                    >
                                        DSP Platform
                                    </Typography.Text>
                                </div>
                            </div>
                            {item.totalViews !== undefined && (
                                <Typography.Text
                                    type="secondary"
                                    className="shrink-0 text-right text-xs"
                                >
                                    {formattedNumber(item.totalViews)} views
                                </Typography.Text>
                            )}
                        </div>
                    </List.Item>
                );
            }}
        />
    );
}
