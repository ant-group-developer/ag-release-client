import { ZodIssue } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ReleaseFormValuesData } from '../types';

interface ReleaseFormState {
    formValues: Partial<ReleaseFormValuesData>;
    setFormValues: (values: Partial<ReleaseFormValuesData>) => void;
    validationErrors: ZodIssue[];
    setValidationErrors: (errors: ZodIssue[]) => void;
}

const initialValue: ReleaseFormValuesData = {
    thumbnail: undefined,
    releaseType: null,
    nameRelease: '',
    version: '',
    isMoreThan4Artists: false,
    artists: [],
    genres: null,
    subGenres: null,
    metaDataLanguage: '',
    label: '',
    upc: '',
    catalogId: '',
    cLineYear: '',
    pLineYear: '',
    tracks: [],
    releaseDate: '',
    timeZone: '',
    territory: undefined,
    platform: [],
};

export const useReleaseFormStore = create<ReleaseFormState>()(
    persist(
        (set) => ({
            formValues: initialValue,
            setFormValues: (values) => set({ formValues: values }),
            validationErrors: [],
            setValidationErrors: (errors) => set({ validationErrors: errors }),
        }),
        {
            name: 'release-form-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
