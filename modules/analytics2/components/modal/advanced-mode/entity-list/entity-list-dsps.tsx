'use client';

import { formattedNumber } from '@/helpers/common';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { useGetDspRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Empty, List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
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
                                id: item?.pgDspId || item?.dspReportId || '',
                                entitySubId: item?.dspReportId || '',
                                title: item.dspName || '',
                                type: 'DSP',
                                thumbnailUrl: dspLogo || undefined,
                                subtitle: `${formattedNumber(item.totalViews)} views`,
                            })
                        }
                        className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <div className="flex w-full items-center justify-between gap-3 px-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <ReleaseCoverImage
                                    width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                                    height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                                    src={dspLogo}
                                />

                                <div className="flex flex-col overflow-hidden">
                                    <Typography.Text
                                        ellipsis={{ tooltip: item.dspName }}
                                        className="text-sm font-medium"
                                    >
                                        {item.dspName}
                                    </Typography.Text>
                                    {/* <Typography.Text
                                        type="secondary"
                                        className="text-xs"
                                    >
                                        DSP Platform
                                    </Typography.Text> */}
                                </div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
}
