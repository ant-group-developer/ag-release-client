import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    RevenueQueryParams,
    RevenueSummaryData,
    RevenueTimelineData,
    RevenueDspItem,
    RevenueArtistItem,
    RevenueTrackItem,
} from '../types';

export const useGetRevenueSummary = (params: { fromDate: string; toDate: string }) => {
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

export const useGetRevenueTopDsp = (params: RevenueQueryParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueTopDsp(params),
        queryFn: () => analytics2Apis.getRevenueTopDsp(params),
        placeholderData: (prev) => prev,
    });

    return {
        topDspData: data?.data?.data ?? ([] as RevenueDspItem[]),
        ...res,
    };
};

export const useGetRevenueTopArtist = (params: RevenueQueryParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueTopArtist(params),
        queryFn: () => analytics2Apis.getRevenueTopArtist(params),
        placeholderData: (prev) => prev,
    });

    return {
        topArtistData: data?.data?.data ?? ([] as RevenueArtistItem[]),
        ...res,
    };
};

export const useGetRevenueTopTrack = (params: RevenueQueryParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueTopTrack(params),
        queryFn: () => analytics2Apis.getRevenueTopTrack(params),
        placeholderData: (prev) => prev,
    });

    return {
        topTrackData: data?.data?.data ?? ([] as RevenueTrackItem[]),
        ...res,
    };
};
