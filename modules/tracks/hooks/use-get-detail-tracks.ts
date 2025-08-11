import { OriginType } from '@/components/ui/select/original-type-select';
import { useQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackData } from '../types';

export const useGetDetailTrack = (id: TrackData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: trackQueryKeys.detail(id),
        queryFn: () => trackApi.getDetailTrack(id),
        enabled: !!id,
    });

    const defaultData: TrackData = {
        title: '',
        picture: null,
        version: null,
        isrc: null,
        iswc: null,
        releaseId: '',
        pLineOwner: null,
        primaryGenreId: null,
        primaryGenre: null,
        subGenreId: null,
        subGenre: null,
        originTypeId: '',
        originType: OriginType.ORIGINAL,
        isSensitiveContent: false,
        lyric: '',
        trackTypeId: '',
        trackType: null,
        copyArtistsFromRelease: false,
        trackOriginTypeId: null,
        trackOriginType: null,
        preview: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        pLineYear: undefined,
        release: {
            id: '',
            title: '',
        },
    };

    return {
        trackData: data?.data?.data ?? defaultData,
        ...res,
    };
};
