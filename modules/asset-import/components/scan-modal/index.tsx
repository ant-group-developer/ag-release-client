import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { Button, Form, Modal } from 'antd';
import axios from 'axios';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TYPE_MODAL_ASSET_IMPORT } from '../../enums';
import { usePresignAssetImport } from '../../hooks/use-presign-asset-import';
import { useDownloadAssetImportTemplate } from '../../hooks/use-download-template';
import { useScanAssetImport } from '../../hooks/use-scan-asset-import';
import { PresignUploadResponse } from '../../types/payload';
import { ScanForm } from './scan-form';

const uploadFileWithProgress = async (
    url: string,
    file: File,
    onProgress: (percent: number) => void
): Promise<void> => {
    const response = await axios.put(url, file, {
        headers: {
            'Content-Type': file.type || 'application/octet-stream',
        },
        onUploadProgress: (progressEvent) => {
            const percent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            onProgress(percent);
        },
    });

    if (!response.status || response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};

export default function ScanAssetImportModal() {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const open = typeModal === TYPE_MODAL_ASSET_IMPORT.SCAN;

    const [isUploading, setIsUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    const { presignAssetImport } = usePresignAssetImport();
    const { scanAssetImport, isPending: isScanning } = useScanAssetImport();
    const {
        downloadAssetImportTemplate,
        isPending: isDownloadingTemplate,
    } = useDownloadAssetImportTemplate();

    const isProcessing = isUploading || isScanning;

    const handleClose = () => {
        if (isProcessing) return;
        form.resetFields();
        setUploadPercent(0);
        closeModal();
    };

    const handleSubmit = (values: any) => {
        const fileItem = values?.file?.[0];
        const file = fileItem?.originFileObj as File;

        if (!file) {
            showNotification('error', messages('validation.file'));
            return;
        }

        const {
            targetTenantId,
            updateOwnership,
            overwriteMetadata,
            createIfNotFound,
            fillEmptyOnly,
            createLabelIfMissing,
        } = values;

        setIsUploading(true);
        setUploadPercent(0);

        presignAssetImport({
            payload: {
                fileName: file.name,
                contentType: file.type || 'application/octet-stream',
            },
            onSuccess: async (presignData: PresignUploadResponse) => {
                try {
                    await uploadFileWithProgress(
                        presignData.uploadUrl,
                        file,
                        setUploadPercent
                    );

                    setIsUploading(false);

                    scanAssetImport({
                        payload: {
                            r2Key: presignData.r2Key,
                            targetTenantId,
                            options: {
                                updateOwnership,
                                overwriteMetadata,
                                createIfNotFound,
                                fillEmptyOnly,
                                createLabelIfMissing,
                            },
                        },
                        onSuccess: () => {
                            handleClose();
                        },
                    });
                } catch (error: any) {
                    setIsUploading(false);
                    showNotification(
                        'error',
                        error?.message ||
                            messages('assetImport.scan.uploadFailed')
                    );
                }
            },
            onError: () => {
                setIsUploading(false);
            },
        });
    };

    return (
        <Modal
            title={
                <div className="flex items-center justify-between gap-4 pr-10">
                    <span>{messages('assetImport.scan.title')}</span>
                    <Button
                        type="link"
                        icon={<Download size={16} />}
                        loading={isDownloadingTemplate}
                        onClick={() => downloadAssetImportTemplate()}
                    >
                        {messages('assetImport.scan.downloadTemplate')}
                    </Button>
                </div>
            }
            open={open}
            centered
            destroyOnHidden
            closable={!isProcessing}
            maskClosable={!isProcessing}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okText={messages('common.submit')}
            cancelText={messages('common.cancel')}
            okButtonProps={{ loading: isProcessing }}
            cancelButtonProps={{ disabled: isProcessing }}
        >
            <ScanForm
                form={form}
                onSubmit={handleSubmit}
                isUploading={isProcessing}
                uploadPercent={uploadPercent}
            />
        </Modal>
    );
}
