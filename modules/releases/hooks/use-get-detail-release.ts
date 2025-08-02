import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { RELEASES_STATUS } from '../enums';
import { ReleasesData } from '../types';

export const useGetDetailRelease = (id: ReleasesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...releasesQueryKeys.getDetail, id],
        queryFn: () => releasesApi.getDetail(id),
        enabled: !!id,
    });

    const defaultData: ReleasesData = {
        creatorId: '',
        modifierId: '',
        upc: '',
        primaryGenreId: '',
        subGenreId: '',
        labelId: '',
        title: '',
        version: null,
        status: RELEASES_STATUS.DRAFT,
        tracks: [],
        releaseArtists: [],
        primaryGenre: undefined,
        id: '',
        createdAt: '',
        updatedAt: null,
        pLineOwner: '',
        cLineOwner: '',
        catalogId: null,
        isVariousArtist: false,
        releaseDate: '',
        releaseTime: '',
        releaseTimezoneId: null,
        releaseTerritory: {
            distributeWorldwide: false,
            selectedCountries: [],
            distributionType: '',
        },
        timeZone: null,
        isSensitiveContent: false,
        tracksCount: 0,
        albumFormat: {
            name: '',
            value: '',
            minTrackCount: 0,
            maxTrackCount: 0,
            id: '',
            createdAt: '',
            updatedAt: null,
        },
        albumFormatId: '',
        totalDuration: 0,
    };

    return {
        releaseData: data?.data?.data ?? defaultData,
        ...res,
    };
};
