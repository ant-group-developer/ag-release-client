import { useInfiniteQuery } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { TimelineEvent } from '../types';

interface Options {
    /** Số event mỗi trang (default server 50, max 200). */
    limit?: number;
    enabled?: boolean;
}

/**
 * GET /distributions/:id/timeline — cursor pagination (useInfiniteQuery).
 * `nextCursor` từ page trước → truyền vào `cursor` page kế; null = hết trang.
 * Trả `timelineEvents` đã flatten + helper phân trang.
 */
export const useGetTimeline = (id?: string, options: Options = {}) => {
    const { limit, enabled = true } = options;

    const { data, ...rest } = useInfiniteQuery({
        queryKey: distributionOrchestrationQueryKeys.timeline(id ?? '', {
            limit,
        }),
        queryFn: ({ pageParam }) =>
            distributionOrchestrationApis.getTimeline(id as string, {
                cursor: pageParam || undefined,
                limit,
            }),
        getNextPageParam: (lastPage) =>
            lastPage?.data?.data?.nextCursor ?? undefined,
        enabled: enabled && !!id,
        initialPageParam: '' as string,
        placeholderData: (prev) => prev,
    });

    const timelineEvents: TimelineEvent[] =
        data?.pages.flatMap((page) => page?.data?.data?.items ?? []) ?? [];

    return { timelineEvents, ...rest };
};
