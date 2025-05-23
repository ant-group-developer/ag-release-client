import { FormInstance } from 'antd';
import { create } from 'zustand';

interface ReleaseFormState {
    form: FormInstance | null;
    formValues: any; // Thêm trường này để lưu giá trị form
    setForm: (form: FormInstance) => void;
    setFormValues: (values: any) => void; // Thêm action này
}

export const useReleaseFormStore = create<ReleaseFormState>((set) => ({
    form: null,
    formValues: {},
    setForm: (form) => set({ form }),
    setFormValues: (values) => set({ formValues: values }),
}));
