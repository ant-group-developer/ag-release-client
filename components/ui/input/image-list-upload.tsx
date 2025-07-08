import { FileType, getBase64 } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { Image, Upload, UploadFile, UploadProps } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type Props = UploadProps & {
    value?: any;
    placeholder?: string;
    maxSizeMB?: number;
};

export default function ImageListUpload({
    placeholder,
    value,
    maxSizeMB = 5,
    ...props
}: Props) {
    const messages = useTranslations();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [showText, setShowText] = useState(true);
    const fileList = value?.fileList || [];
    const containerRef = useRef<HTMLDivElement>(null);

    function beforeUpload(file: File) {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            showNotification('error', messages('validation.image'));
            return Upload.LIST_IGNORE;
        }
        const isLessThanMaxSize = file.size / 1024 / 1024 < maxSizeMB;
        if (!isLessThanMaxSize) {
            showNotification(
                'error',
                `${messages('image.validation.mustBeLessThanMB', { value: maxSizeMB })}`
            );
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
            {showText && (
                <div style={{ marginTop: 8 }}>
                    {placeholder ?? messages('common.upload')}
                </div>
            )}
        </button>
    );

    useEffect(() => {
        function checkWidth() {
            const width = containerRef.current?.offsetWidth || 0;

            setShowText(width >= 60);
        }

        const raf = requestAnimationFrame(checkWidth);

        window.addEventListener('resize', checkWidth);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', checkWidth);
        };
    }, []);

    return (
        <div ref={containerRef}>
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
        </div>
    );
}
