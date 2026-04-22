import { SIZE_ICON_BIG } from '@/constants/common';
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
                <div className="flex items-center gap-2">
                    {typeDelete && <CircleAlert size={SIZE_ICON_BIG} />}
                    {modalTitle}
                </div>
            }
            okButtonProps={{
                danger: typeDelete,
                ghost: typeDelete,
                disabled: loading,
            }}
            cancelButtonProps={{
                type: 'default',
                // ghost: true,
                disabled: loading,
            }}
        >
            {paragraph}
        </AppModal>
    );
};

export default AppConfirm;
