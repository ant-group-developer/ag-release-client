import { QUERY_KEY } from '@/constants/query-key';
import { ReleasesDataFilter, UseReleaseEnrichedErrorsParams } from '../types';

export const releasesQueryKeys = {
    all: [QUERY_KEY.RELEASES.KEY] as const,

    downloadAssets: () => [
        ...releasesQueryKeys.all,
        QUERY_KEY.RELEASES.DOWNLOAD_ASSET,
    ],
    lists: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.GET_LIST] as const,
    list: (params?: ReleasesDataFilter) =>
        params
            ? ([...releasesQueryKeys.lists(), params] as const)
            : releasesQueryKeys.lists(),

    details: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.GET_DETAIL] as const,
    detail: (id: string) => [...releasesQueryKeys.details(), id] as const,

    validations: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.VALIDATE] as const,
    validate: (id: string) => [...releasesQueryKeys.validations(), id] as const,

    enrichedErrors: () =>
        [
            ...releasesQueryKeys.all,
            QUERY_KEY.RELEASES.GET_ENRICHED_ERRORS,
        ] as const,
    enrichedError: (params: UseReleaseEnrichedErrorsParams) =>
        [...releasesQueryKeys.enrichedErrors(), params] as const,

    captions: () =>
        [...releasesQueryKeys.all, QUERY_KEY.RELEASES.GET_CAPTIONS] as const,
    captionList: (id: string, type?: string) =>
        [...releasesQueryKeys.captions(), id, type] as const,
};
