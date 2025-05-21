import { FormInstance } from 'antd/es/form';
import { create } from 'zustand';

type ReleaseFormStore = {
    form: FormInstance | null;
    setForm: (form: FormInstance) => void;
};

export const useReleaseFormStore = create<ReleaseFormStore>((set) => ({
    form: null,
    setForm: (form) => set({ form }),
}));
