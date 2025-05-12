import { FileType, getBase64 } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { Image, Upload, UploadFile, UploadProps } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = UploadProps & {
    value?: any;
};

export default function ImageListUpload({ value, ...props }: Props) {
    const messages = useTranslations();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const fileList = value?.fileList || [];

    function beforeUpload(file: File) {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            showNotification('error', messages('validation.image'));
            return Upload.LIST_IGNORE;
        }
        return false;
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || file.preview || '');

        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        props.onChange?.(info);
    };

    const uploadButton = (
        <button className="flex flex-col items-center" type="button">
            <Plus />
            <div style={{ marginTop: 8 }}> {messages('common.upload')} </div>
        </button>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                multiple
                {...props}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
            >
                {fileList.length >= (props.maxCount || 0) ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    alt=""
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
}
