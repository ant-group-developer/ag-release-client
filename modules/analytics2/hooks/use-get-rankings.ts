import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetTrackRanking = (params: RankingParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackRanking(params),
        queryFn: () => analytics2Apis.getTrackRanking(params),
        placeholderData: (prev) => prev,
    });

    return {
        trackRankingData: data?.data?.data?.items ?? [],
        ...res,
    };
};

export const useGetReleaseRanking = (params: RankingParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseRanking(params),
        queryFn: () => analytics2Apis.getReleaseRanking(params),
        placeholderData: (prev) => prev,
    });

    return {
        releaseRankingData: data?.data?.data?.items ?? [],
        ...res,
    };
};

export const useGetArtistRanking = (params: RankingParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.artistRanking(params),
        queryFn: () => analytics2Apis.getArtistRanking(params),
        placeholderData: (prev) => prev,
    });

    return {
        artistRankingData: data?.data?.data?.items ?? [],
        ...res,
    };
};

export const useGetLabelRanking = (params: RankingParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelRanking(params),
        queryFn: () => analytics2Apis.getLabelRanking(params),
        placeholderData: (prev) => prev,
    });

    return {
        labelRankingData: data?.data?.data?.items ?? [],
        ...res,
    };
};
