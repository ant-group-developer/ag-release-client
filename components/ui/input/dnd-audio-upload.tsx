import { getFileDuration, getFileName } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

interface DndAudioUploadProps extends UploadProps {
    value?: any;
    placeholder?: string;
}

const { Dragger } = Upload;

const DndAudioUpload = ({
    value,
    maxCount = 1,
    disabled,
    placeholder,
    ...props
}: DndAudioUploadProps) => {
    const [audioUrl, setAudioUrl] = useState('');
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [audioName, setAudioName] = useState<string>('');
    const fileList = value?.fileList || [];
    const message = useTranslations();

    function beforeUpload(file: File) {
        const isAudio = file.type.startsWith('audio/');
        if (!isAudio) {
            showNotification('error', 'Please select an audio file');
            return Upload.LIST_IGNORE;
        }
        return false;
    }

    const onChange: UploadProps['onChange'] = async (info) => {
        const { fileList } = info;
        if (fileList[0]?.originFileObj) {
            const file = fileList[0].originFileObj;
            const audioObjectUrl = URL.createObjectURL(file);
            setAudioUrl(audioObjectUrl);
            setAudioName(getFileName(file));

            try {
                const duration = await getFileDuration(file);
                setAudioDuration(duration);
            } catch (error) {
                console.error('Error getting audio duration:', error);
            }
        }
        props.onChange?.(info);
    };

    const onRemove: UploadProps['onRemove'] = (file) => {
        setAudioUrl('');
        setAudioDuration(0);
        setAudioName('');
        props.onRemove?.(file);
        return true;
    };

    const uploadProps: DndAudioUploadProps = {
        ...props,
        fileList: fileList,
        beforeUpload: beforeUpload,
        onChange: onChange,
        onRemove: onRemove,
        accept: 'audio/*',
        maxCount: maxCount,
        disabled: disabled,
    };

    return (
        <React.Fragment>
            <Dragger {...uploadProps}>
                <p className="mx-auto mb-3 grid aspect-square w-14 place-content-center rounded-full bg-gray-200 text-2xl">
                    <UploadIcon />
                </p>
                <p className="ant-upload-text">
                    {placeholder ?? message('placeholder.dragAndDropAudio')}
                </p>
            </Dragger>
            {audioUrl && (
                <div className="mt-4">
                    <div className="mb-2 text-sm font-medium">
                        {audioName} ({audioDuration}s)
                    </div>
                    <audio controls className="w-full">
                        <source src={audioUrl} />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}
        </React.Fragment>
    );
};

export default DndAudioUpload;
