import { LoadingType, useLoading } from '@/hooks/use-loading';
import { CircleAlert } from 'lucide-react';
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
    const loading = useLoading(LoadingType.Mutating);
    return (
        <AppModal
            loading={loading}
            {...props}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            title={
                <div className="flex gap-2">
                    <CircleAlert className="text-red-500" /> {modalTitle}
                </div>
            }
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
