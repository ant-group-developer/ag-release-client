import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetTrackRanking = (
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.trackRanking(params),
        queryFn: () => analytics2Apis.getTrackRanking(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const trackRankingData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        trackRankingData,
        ...query,
    };
};

export const useGetReleaseRanking = (
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.releaseRanking(params),
        queryFn: () => analytics2Apis.getReleaseRanking(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const releaseRankingData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releaseRankingData,
        ...query,
    };
};

export const useGetArtistRanking = (
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.artistRanking(params),
        queryFn: () => analytics2Apis.getArtistRanking(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const artistRankingData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistRankingData,
        ...query,
    };
};

export const useGetLabelRanking = (
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.labelRanking(params),
        queryFn: () => analytics2Apis.getLabelRanking(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const labelRankingData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        labelRankingData,
        ...query,
    };
};

export const useGetTenantRanking = (
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.tenantRanking(params),
        queryFn: () => analytics2Apis.getTenantRanking(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const tenantRankingData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        tenantRankingData,
        ...query,
    };
};

export const useGetDspRanking = (
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.dspRanking(params),
        queryFn: () => analytics2Apis.getDspRanking(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const dspRankingData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        dspRankingData,
        ...query,
    };
};

