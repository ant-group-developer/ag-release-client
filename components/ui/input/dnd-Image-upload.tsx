import { showNotification } from '@/helpers/messages-helper';
import { Image, Modal, Upload } from 'antd';
// import Image from 'next/image';
import type { UploadFile, UploadProps } from 'antd';
import { UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

interface DndImageUploadProps extends UploadProps {
    value?: any;
    placeholder?: string;
}

const { Dragger } = Upload;

const DndImageUpload = ({
    value,
    onChange,
    maxCount = 1,
    disabled,
    placeholder,
    ...props
}: DndImageUploadProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<undefined | string>('');
    const [previewTitle, setPreviewTitle] = useState<undefined | string>('');
    const fileList = value?.fileList || [];
    const message = useTranslations();
    function beforeUpload(file: File) {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            showNotification('error', 'Please select a image file');
            return Upload.LIST_IGNORE;
        }
        return false;
    }

    function handleCancel() {
        setPreviewOpen(false);
    }

    async function handlePreview(file: UploadFile) {
        if (!file.url && !file.preview) {
            file.preview = (await getBase64(file.originFileObj)) as string;
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name ||
                file.url?.slice(
                    file.url?.lastIndexOf('/') + 1,
                    file.url?.indexOf('?')
                )
        );
    }

    const uploadProps: DndImageUploadProps = {
        listType: 'picture',
        ...props,
        fileList: fileList,
        beforeUpload: beforeUpload,
        onChange: onChange,
        onPreview: handlePreview,
        accept: 'image/*',
        disabled: disabled,
        maxCount: maxCount,
    };

    return (
        <React.Fragment>
            <Dragger {...uploadProps}>
                <p className="mx-auto mb-3 grid aspect-square w-14 place-content-center rounded-full bg-gray-200 text-2xl">
                    <UploadIcon />
                </p>
                <p className="ant-upload-text">
                    {placeholder ?? message('message.dragAndDropImage')}
                </p>
            </Dragger>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                width={500}
                className="top-10"
            >
                <Image
                    alt="thumbnail"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                    // width={1400}
                    // height={1000}
                />
            </Modal>
        </React.Fragment>
    );
};

export default DndImageUpload;
