import type { UploadProps } from 'antd';
import { Upload, UploadFile } from 'antd';
import { UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

interface DndUploadProps extends UploadProps {
    value?: any;
    placeholder?: ReactNode;
}

const { Dragger } = Upload;

const DndUpload = ({
    value,
    maxCount = 10,
    disabled,
    placeholder,
    multiple = true,
    ...props
}: DndUploadProps) => {
    const fileList: UploadFile[] = value?.fileList || [];
    const message = useTranslations();

    const uploadProps: UploadProps = {
        ...props,
        fileList,
        maxCount,
        disabled,
        multiple,
    };

    return (
        <Dragger {...uploadProps}>
            <p className="mx-auto mb-3 grid aspect-square w-14 place-content-center rounded-full bg-gray-200 text-2xl">
                <UploadIcon />
            </p>
            <p className="ant-upload-text">
                {placeholder ?? message('placeholder.dragAndDropFile')}
            </p>
        </Dragger>
    );
};

export default DndUpload;
