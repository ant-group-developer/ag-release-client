import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';

import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    AnalyticsCommonParams,
    RevenueQueryParams,
    RevenueSummaryData,
    RevenueTimelineData,
} from '../types';

export const useGetRevenueSummary = (params: AnalyticsCommonParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueSummary(params),
        queryFn: () => analytics2Apis.getRevenueSummary(params),
        placeholderData: (prev) => prev,
    });

    return {
        summaryData: data?.data?.data ?? ({} as RevenueSummaryData),
        ...res,
    };
};

export const useGetRevenueTimeline = (params: RevenueQueryParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueTimeline(params),
        queryFn: () => analytics2Apis.getRevenueTimeline(params),
        placeholderData: (prev) => prev,
    });

    return {
        timelineData: data?.data?.data ?? ({} as RevenueTimelineData),
        ...res,
    };
};

export const useGetRevenueTopDsp = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopDsp(params),
        queryFn: () => analytics2Apis.getRevenueTopDsp(params),
        placeholderData: (prev) => prev,
        ...options,
        // enabled:
        //     (options?.enabled ?? true) &&
        //     Boolean(params.dspReportId || params.pgDspId),
    });

    const topDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topDspData,
        ...query,
    };
};

export const useGetRevenueTopTenant = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopTenant(params),
        queryFn: () => analytics2Apis.getRevenueTopTenant(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topTenantData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topTenantData,
        ...query,
    };
};

export const useGetRevenueTopArtist = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopArtist(params),
        queryFn: () => analytics2Apis.getRevenueTopArtist(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topArtistData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topArtistData,
        ...query,
    };
};

export const useGetRevenueTopTrack = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopTrack(params),
        queryFn: () => analytics2Apis.getRevenueTopTrack(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topTrackData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topTrackData,
        ...query,
    };
};

export const useGetRevenueTopRelease = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopRelease(params),
        queryFn: () => analytics2Apis.getRevenueTopRelease(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topReleaseData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topReleaseData,
        ...query,
    };
};

export const useGetRevenueTopReleaseVideo = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopReleaseVideo(params),
        queryFn: () => analytics2Apis.getRevenueTopReleaseVideo(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topReleaseVideoData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topReleaseVideoData,
        ...query,
    };
};

export const useGetRevenueTopLabel = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopLabel(params),
        queryFn: () => analytics2Apis.getRevenueTopLabel(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topLabelData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topLabelData,
        ...query,
    };
};

export const useGetRevenueTopChannel = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopChannel(params),
        queryFn: () => analytics2Apis.getRevenueTopChannel(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topChannelData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topChannelData,
        ...query,
    };
};

export const useGetRevenueTopSourceType = (
    params: RevenueQueryParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.revenueTopSourceType(params),
        queryFn: () => analytics2Apis.getRevenueTopSourceType(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const topSourceTypeData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        topSourceTypeData,
        ...query,
    };
};
