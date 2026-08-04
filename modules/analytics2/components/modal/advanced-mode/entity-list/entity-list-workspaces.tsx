'use client';

import { useGetTenantRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { TenantRankingItem } from '@/modules/analytics2/types';
import TenantTag from '@/modules/tenant/components/tenant-tag';
import { Avatar, Empty, List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { ContentItem } from '../content-entity-selector';

interface Props {
    fromDate?: string;
    toDate?: string;
    keyword?: string;
    onSelect: (item: ContentItem) => void;
}

export default function EntityListWorkspaces({
    fromDate = dayjs().subtract(27, 'day').format('YYYY-MM-DD'),
    toDate = dayjs().format('YYYY-MM-DD'),
    keyword,
    onSelect,
}: Props) {
    const { tenantRankingData, isFetching } = useGetTenantRanking({
        fromDate,
        toDate,
        page: 1,
        pageSize: 15,
        keyword,
    });

    if (isFetching && !tenantRankingData?.items?.length) {
        return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;
    }

    const items = tenantRankingData?.items || [];

    if (!items.length) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;
    }

    return (
        <List
            dataSource={items}
            renderItem={(item: TenantRankingItem) => (
                <List.Item
                    onClick={() =>
                        onSelect({
                            id: item.tenantId,
                            title: item.tenantName,
                            type: 'Workspace',
                            thumbnailUrl: item.logo || '',
                            // subtitle: `${formattedNumber(item.totalViews)} views`,
                        })
                    }
                    className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                    <div className="flex w-full items-center justify-between gap-3 px-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar
                                shape="square"
                                size={40}
                                src={item.logo}
                                className="shrink-0 rounded-md"
                            >
                                {(item.tenantName || 'W')[0]?.toUpperCase()}
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <Typography.Text
                                    ellipsis={{ tooltip: item.tenantName }}
                                    className="text-sm font-medium"
                                >
                                    {item.tenantName}
                                </Typography.Text>
                                <div className="mt-0.5">
                                    <TenantTag type={item.type} />
                                </div>
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );
}
