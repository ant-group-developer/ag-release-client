import { SIZE_ICON } from '@/constants/common';
import { getFileDuration } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import { TrashIcon, UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useState } from 'react';
import IconButton from '../button/icon-button';

interface DndAudioUploadProps extends UploadProps {
    value?: any;
    placeholder?: ReactNode;
}

const { Dragger } = Upload;

interface AudioFile {
    url: string;
    duration: number;
    name: string;
}

const DndAudioUpload = ({
    value,
    maxCount = 10,
    disabled,
    placeholder,
    multiple = true,
    ...props
}: DndAudioUploadProps) => {
    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const fileList = value?.fileList || [];
    const message = useTranslations();

    function beforeUpload(file: File) {
        // Lấy accept từ props hoặc mặc định
        const accept = props.accept || 'audio/*';

        // Tách các định dạng, loại bỏ khoảng trắng
        const acceptList = accept.split(',').map((item) => item.trim());

        // Kiểm tra theo mime type
        const isAcceptedType = acceptList.some((type) => {
            if (type === 'audio/*') return file.type.startsWith('audio/');
            if (type.startsWith('.')) return file.name.endsWith(type); // ví dụ: .mp3
            return file.type === type;
        });

        if (!isAcceptedType) {
            showNotification(
                'error',
                message('validation.onlyTheFollowingFormatsAreAccepted', {
                    accept: acceptList.join(', '),
                })
            );
            return Upload.LIST_IGNORE;
        }
        return false;
    }

    const onChange: UploadProps['onChange'] = async (info) => {
        const { fileList } = info;

        const newAudioFiles: AudioFile[] = [];

        for (const fileInfo of fileList) {
            if (fileInfo.originFileObj) {
                const file = fileInfo.originFileObj;
                const audioObjectUrl = URL.createObjectURL(file);
                const fileName = fileInfo.name;

                try {
                    const duration = await getFileDuration(file);
                    newAudioFiles.push({
                        url: audioObjectUrl,
                        duration,
                        name: fileName,
                    });
                } catch (error) {
                    console.error('Error getting audio duration:', error);
                }
            }
        }

        setAudioFiles(newAudioFiles);
        props.onChange?.(info);
    };

    const onRemove: UploadProps['onRemove'] = (file) => {
        const newAudioFiles = audioFiles.filter(
            (_, index) =>
                index !== fileList.findIndex((f: any) => f.uid === file.uid)
        );
        setAudioFiles(newAudioFiles);
        props.onRemove?.(file);
        return true;
    };

    const uploadProps: DndAudioUploadProps = {
        ...props,
        fileList: fileList,
        beforeUpload: beforeUpload,
        onChange: onChange,
        onRemove: onRemove,
        accept: props.accept || 'audio/*',
        maxCount: maxCount,
        disabled: disabled,
        multiple: multiple,
        showUploadList: false,
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

            {audioFiles.length > 0 && (
                <div className="mt-4 max-h-[400px] space-y-4 overflow-y-auto">
                    {audioFiles.map((audioFile, index) => (
                        <div key={index} className="rounded border p-3">
                            <div className="mb-2 flex justify-between text-sm font-medium">
                                <div>{audioFile.name}</div>
                                <div>
                                    <Button
                                        type="link"
                                        icon={
                                            <IconButton>
                                                <TrashIcon
                                                    size={SIZE_ICON}
                                                    className="text-red-500"
                                                />
                                            </IconButton>
                                        }
                                        onClick={() => {
                                            const uploadFile = fileList[index];
                                            if (uploadFile)
                                                onRemove(uploadFile);
                                        }}
                                    />
                                </div>
                            </div>
                            <audio controls className="w-full">
                                <source src={audioFile.url} />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default DndAudioUpload;
