import { create } from 'zustand';

export interface PermissionState {
    permission: Set<string>;
    setPermission: (data: string[]) => void;
}
const usePermissionStore = create<PermissionState>((set) => {
    const setPermission = (data: string[]) => {
        set({
            permission: new Set(data),
        });
    };

    return {
        permission: new Set([]),
        setPermission,
    };
});

export default usePermissionStore;
