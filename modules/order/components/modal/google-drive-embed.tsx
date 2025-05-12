import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { getLinkDrivePreview } from '@/helpers/link';
import { useTranslations } from 'next-intl';
import React from 'react';

type GoogleDriveEmbedModalProps = Omit<AppModalProps, 'children'> & {
    fileId: string;
    onClose: () => void;
};

const GoogleDriveEmbedModal: React.FC<GoogleDriveEmbedModalProps> = ({
    fileId,
    onClose,
    ...props
}: GoogleDriveEmbedModalProps) => {
    const messages = useTranslations();
    if (!fileId) return null;
    const previewUrl = getLinkDrivePreview(fileId);

    return (
        <AppModal
            width={1000}
            {...props}
            title={messages('common.guide')}
            footer={null}
            onCancel={onClose}
            maskClosable={true}
            className="!top-5"
        >
            <div className="h-[calc(100vh-150px)] overflow-hidden rounded-lg border border-gray-600">
                <iframe
                    className="h-full w-full"
                    src={previewUrl}
                    title="Google Drive File"
                    frameBorder="0"
                />
            </div>
        </AppModal>
    );
};

export default GoogleDriveEmbedModal;
