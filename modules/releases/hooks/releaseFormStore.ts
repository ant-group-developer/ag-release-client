import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReleaseFormState {
    formValues: Record<string, any>;
    setFormValues: (values: Record<string, any>) => void;
}

export const useReleaseFormStore = create<ReleaseFormState>()(
    persist(
        (set) => ({
            formValues: {},
            setFormValues: (values) => set({ formValues: values }),
        }),
        {
            name: 'release-form-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
