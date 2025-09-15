import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistData } from '../types';

export const useGetDetailArtist = (id: ArtistData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: artistQueryKeys.detail(id),
        queryFn: () => artistApi.getDetail(id),
        enabled: !!id,
    });

    const defaultData: ArtistData = {
        name: '',
        biography: '',
        creatorId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        releaseCount: 0,
        trackCount: 0,
        code: '',
        country: {
            name: '',
            iso3: '',
            iso2: '',
            numericCode: '',
            phoneCode: '',
            capital: '',
            currency: '',
            currencyName: '',
            currencySymbol: '',
            nationality: '',
            regionId: 0,
            id: '',
            createdAt: '',
            updatedAt: null,
        },
        genre: {
            name: '',
            code: '',
            description: '',
            id: '',
            createdAt: '',
            updatedAt: null,
        },
    };

    return {
        artistData: data?.data?.data ?? defaultData,
        ...res,
    };
};
