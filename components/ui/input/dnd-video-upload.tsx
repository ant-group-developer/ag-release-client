import { showNotification } from '@/helpers/messages-helper';
import { Upload } from 'antd';
// import Image from 'next/image';
import type { UploadProps } from 'antd';
import { UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface DndVideoUploadProps extends UploadProps {
    value?: any;
}

const { Dragger } = Upload;

const DndVideoUpload = ({
    value,
    maxCount = 1,
    listType = 'picture',
    disabled,
    ...props
}: DndVideoUploadProps) => {
    const [videoUrl, setVideoUrl] = useState('');
    const fileList = value?.fileList || [];
    const message = useTranslations();

    function beforeUpload(file: File) {
        const isVideo = file.type.startsWith('video/');
        if (!isVideo) {
            showNotification('error', 'Please select a video file');
            return Upload.LIST_IGNORE;
        }
        return false;
    }

    const onChange: UploadProps['onChange'] = (info) => {
        const { fileList } = info;
        if (fileList[0]?.originFileObj) {
            const videoObjectUrl = URL.createObjectURL(
                fileList[0].originFileObj
            );
            setVideoUrl(videoObjectUrl);
        }
        props.onChange?.(info);
    };

    const onRemove: UploadProps['onRemove'] = (file) => {
        setVideoUrl('');
        props.onRemove?.(file);
        return true;
    };

    const uploadProps: DndVideoUploadProps = {
        ...props,
        fileList: fileList,
        beforeUpload: beforeUpload,
        onChange: onChange,
        onRemove: onRemove,
        accept: 'video/*',
        maxCount: maxCount,
    };

    return (
        <React.Fragment>
            <Dragger {...uploadProps}>
                <p className="mx-auto mb-3 grid aspect-square w-14 place-content-center rounded-full bg-gray-200 text-2xl">
                    <UploadIcon />
                </p>
                <p className="ant-upload-text">
                    {message('message.dragAndDropVideo')}
                </p>
            </Dragger>
            {videoUrl && (
                <div className="mt-4 aspect-video">
                    <ReactPlayer
                        url={videoUrl}
                        controls
                        width="100%"
                        height="100%"
                    ></ReactPlayer>
                </div>
            )}
        </React.Fragment>
    );
};

export default DndVideoUpload;
