import { create } from 'zustand';

export type OpenModalProps<TypeModal = any, DataType = any> = (
    type: TypeModal,
    data?: DataType | null
) => void;

export type CloseModalProps = () => void;

export interface PermissionState<TModal = any, TData = any> {
    typeModal: TModal | null;
    dataEdit: TData | null;
    openModal: OpenModalProps<TModal, TData>;
    closeModal: CloseModalProps;
}

const useModalStore = create<PermissionState>((set) => {
    const openModal: OpenModalProps = (type, data) => {
        set({
            typeModal: type,
            dataEdit: data ?? null,
        });
    };

    const closeModal: CloseModalProps = () => {
        set({
            typeModal: null,
            dataEdit: null,
        });
    };

    return {
        typeModal: null,
        dataEdit: null,
        openModal,
        closeModal,
    };
});

export default useModalStore;
