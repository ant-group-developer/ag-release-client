import { OriginType } from '@/components/ui/select/original-type-select';
import { TrackSensitiveData } from '@/modules/track-sensitive/types';
import { useQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { SCAN_COPYRIGHT_STATUS } from '../enums';
import { TrackData } from '../types';

export const useGetDetailTrack = (id: TrackData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: trackQueryKeys.detail(id),
        queryFn: () => trackApi.getDetailTrack(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
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
        isScanned: false,
        priceTierId: '',
        priceTier: {
            currencyId: '',
            isDefault: false,
            isActive: false,
            amount: 0,
            creatorId: '',
            modifierId: '',
            currency: {
                name: '',
                code: '',
                creatorId: '',
                modifierId: '',
                id: '',
                createdAt: '',
                updatedAt: null,
            },
            id: '',
            createdAt: '',
            updatedAt: null,
            code: '',
        },
        trackPolicies: [],
        scanCopyrightStatus: SCAN_COPYRIGHT_STATUS.UN_SCANNED,
        isByAi: false,
        sampleLength: '',
        trackSensitiveId: '',
        trackSensitive: {} as TrackSensitiveData,
    };

    return {
        trackData: data?.data?.data ?? defaultData,
        ...res,
    };
};
