import type { UploadProps } from 'antd';
import { theme, Upload, UploadFile } from 'antd';
import { CloudUpload } from 'lucide-react';
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
    const { token } = theme.useToken();

    const uploadProps: UploadProps = {
        ...props,
        fileList,
        maxCount,
        disabled,
        multiple,
    };

    return (
        <Dragger {...uploadProps}>
            <p className="mx-auto grid aspect-square w-14 place-content-center text-2xl">
                <CloudUpload size={30} color={token.colorPrimary} />
            </p>
            <p className="ant-upload-text">
                {placeholder ?? message('placeholder.dragAndDropFile')}
            </p>
        </Dragger>
    );
};

export default DndUpload;
