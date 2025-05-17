import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, UploadProps } from 'antd';
import { useTranslations } from 'next-intl';

export interface FileUploadProps extends UploadProps {
    value?: any;
}

const FileUpload = ({
    value,
    maxCount = 1,
    listType = 'picture',
    ...props
}: FileUploadProps) => {
    const messages = useTranslations();
    const fileList = value?.fileList || [];

    // Prevent upload action
    function beforeUpload() {
        return false;
    }

    return (
        <Upload
            showUploadList={{
                showRemoveIcon: true,
                showDownloadIcon: true,
            }}
            {...props}
            fileList={fileList}
            beforeUpload={beforeUpload}
            listType={listType}
        >
            {(fileList.length < maxCount && (
                <Button icon={<UploadOutlined />}>
                    {' '}
                    {messages('common.upload')}
                </Button>
            )) ||
                null}
        </Upload>
    );
};

export default FileUpload;
