import { GENRES } from '@/modules/tracks/enums';
import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { RELEASES_STATUS, RELEASES_TYPE } from '../enums';
import { ReleasesData } from '../types';

export const useGetDetailRelease = (id: ReleasesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...releasesQueryKeys.getDetail, id],
        queryFn: () => releasesApi.getDetail(id),
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
        type: RELEASES_TYPE.ALBUM,
        tracks: [],
        releaseArtists: [],
        primaryGenre: undefined,
        subGenre: GENRES.POP,
        coverArtThumbnails: undefined,
        id: '',
        createdAt: '',
        updatedAt: null,
        pLineOwner: '',
        cLineOwner: '',
        catalogId: null,
    };

    return {
        releaseData: data?.data?.data ?? defaultData,
        ...res,
    };
};
