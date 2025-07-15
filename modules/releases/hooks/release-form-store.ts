import { ZodIssue } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { RELEASES_STATUS, RELEASES_TYPE } from '../enums';
import { ReleasesData } from '../types';

export interface ReleaseFormStoreData extends ReleasesData {}

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
    type: RELEASES_TYPE.ALBUM,
    pLineOwner: '',
    cLineOwner: '',
    subGenreId: '',
    labelId: '',
    version: '',
    coverArtThumbnails: undefined,
    catalogId: null,
    isVariousArtist: false,
    creatorId: '',
    modifierId: '',
    upc: '',
    status: RELEASES_STATUS.DRAFT,
    tracks: [],
    releaseArtists: [],
    createdAt: '',
    updatedAt: null,
    releaseDate: '',
    releaseTime: '',
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
