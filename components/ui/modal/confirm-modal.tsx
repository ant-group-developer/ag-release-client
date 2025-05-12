import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import { ReactNode } from 'react';
import AppModal, { AppModalProps } from './normal-modal';

export type AppConfirmProps = {
    typeDelete?: boolean;
    paragraph: ReactNode;
    modalTitle: ReactNode;
} & Omit<AppModalProps, 'children'>;

const AppConfirm = ({
    open,
    onOk,
    onCancel,
    paragraph = '',
    typeDelete = true,
    modalTitle,
    ...props
}: AppConfirmProps) => {
    const loading = useLoading(UseLoadingType.Mutating);
    return (
        <AppModal
            {...props}
            loading={loading}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            title={modalTitle}
            okButtonProps={{
                danger: typeDelete,
                ghost: typeDelete,
                disabled: loading,
            }}
            cancelButtonProps={{
                type: !typeDelete ? 'default' : 'primary',
                ghost: true,
                disabled: loading,
            }}
        >
            {paragraph}
        </AppModal>
    );
};

export default AppConfirm;
