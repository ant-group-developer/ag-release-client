import { USER_TYPE } from '@/modules/user/enums';
import dayjs from 'dayjs';
import { ZodIssue } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { RELEASES_STATUS } from '../enums';
import { ReleasesData } from '../types';

export interface ReleaseFormStoreData extends Omit<ReleasesData, 'tenant'> {}

interface ReleaseFormState {
    formValues: Partial<ReleaseFormStoreData>;
    setFormValues: (values: Partial<ReleaseFormStoreData>) => void;
    resetFormValues: () => void;
    validationErrors: ZodIssue[];
    setValidationErrors: (errors: ZodIssue[]) => void;
}

const initialValue: ReleaseFormStoreData = {
    id: '',
    primaryGenreId: '',
    title: '',
    pLineOwner: '',
    cLineOwner: '',
    subGenreId: '',
    labelId: '',
    version: '',
    catalogId: null,
    isVariousArtist: false,
    creatorId: '',
    modifierId: '',
    upc: '',
    status: RELEASES_STATUS.DRAFT,
    isSensitiveContent: false,
    createdAt: '',
    updatedAt: null,
    releaseDate: '',
    releaseTime: '',
    releaseTimezoneId: null,
    tracks: [],
    releaseTerritory: {
        distributeWorldwide: false,
        selectedCountries: [],
        distributionType: '',
    },
    coverArtThumbnails: {
        original: null,
        '75x75': null,
        '100x100': null,
        '160x160': null,
        '300x300': null,
        '900x900': null,
    },
    releaseLanguage: {
        metadataLanguageId: '',
        audioLanguageId: '',
        metadataLanguageCountryId: '',
        releaseId: '',
        metadataLanguage: {
            name: '',
            code: '',
            id: '',
            createdAt: '',
            updatedAt: null,
        },
        audioLanguage: {
            name: '',
            code: '',
            id: '',
            createdAt: '',
            updatedAt: null,
        },
        metadataLanguageCountry: {
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
    },
    releaseArtists: [],
    timeZone: {
        name: '',
        utc: '',
        zone: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    },
    tracksCount: 0,
    albumFormatId: '',
    albumFormat: {
        name: '',
        code: '',
        minTrackCount: 0,
        maxTrackCount: 0,
        id: '',
        createdAt: '',
        updatedAt: null,
    },
    totalDuration: 0,
    cLineYear: Number(dayjs().year),
    pLineYear: Number(dayjs().year),
    modifier: {
        name: null,
        id: '',
        createdAt: '',
        updatedAt: null,
        email: '',
        avatar: null,
        type: USER_TYPE.USER,
        isActive: false,
        lastLogin: null,
        creator: {
            id: '',
            email: '',
        },
        modifier: {
            id: '',
            email: '',
        },
        tenantUser: [],
    },
};

export const useReleaseFormStore = create<ReleaseFormState>()(
    persist(
        (set) => ({
            formValues: initialValue,
            setFormValues: (values) =>
                set((state) => ({
                    formValues: { ...state.formValues, ...values },
                })),
            resetFormValues: () => set({ formValues: initialValue }),
            validationErrors: [],
            setValidationErrors: (errors) => set({ validationErrors: errors }),
        }),
        {
            name: 'release-form-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
