import { ZodIssue } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { RELEASES_TYPE } from '../enums';

export interface ReleaseFormStoreData {
    id: string;
    primaryGenreId: string;
    subGenreId: string;
    labelId: string;
    title: string;
    version: string | null;
    type: RELEASES_TYPE;
    releaseArtists: any;
    coverArtThumbnails: any;
    pLineOwner: string;
    cLineOwner: string;
    catalogId: string | null;
    upc: string | null;
}

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
    releaseArtists: undefined,
    coverArtThumbnails: undefined,
    catalogId: null,
    upc: null,
};

export const useReleaseFormStore = create<ReleaseFormState>()(
    persist(
        (set) => ({
            formValues: initialValue,
            setFormValues: (values) => set({ formValues: values }),
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
