import { SIZE_ICON } from '@/constants/common';
import { getPeakData } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import { TrashIcon, UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import IconButton from '../button/icon-button';
import WaveformElement from '../wave-form-element/wave-form-element';

interface DndAudioUploadProps extends UploadProps {
    value?: any;
    placeholder?: ReactNode;
}

const { Dragger } = Upload;

export interface AudioFile {
    url: string;
    duration: number;
    name: string;
    peakData: number[];
}

interface AudioItemProps {
    audioFile: AudioFile;
    index: number;
    onRemove: (file: any) => void;
    fileList: any[];
}

const AudioItem = ({
    audioFile,
    index,
    onRemove,
    fileList,
}: AudioItemProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTimePlaying, setCurrentTimePlaying] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTimePlaying(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTimePlaying(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeeking = (second: number) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = second;
        setCurrentTimePlaying(second);
    };

    return (
        <div className="rounded border p-3">
            <div className="mb-2 flex justify-between text-sm font-medium">
                <div className="truncate">{audioFile.name}</div>
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
                            if (uploadFile) onRemove(uploadFile);
                        }}
                    />
                </div>
            </div>
            <WaveformElement
                peakData={audioFile.peakData}
                playedTime={currentTimePlaying}
                songDuration={audioFile.duration}
                playing={isPlaying}
                togglePlayback={togglePlayback}
                handleSeeking={handleSeeking}
            />
            <audio ref={audioRef} className="hidden" src={audioFile.url} />
        </div>
    );
};

const WaveAudioUpload = ({
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
        const accept = props.accept || 'audio/*';
        const acceptList = accept.split(',').map((item) => item.trim());
        const isAcceptedType = acceptList.some((type) => {
            if (type === 'audio/*') return file.type.startsWith('audio/');
            if (type.startsWith('.')) return file.name.endsWith(type);
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
                    const { peakData, songDuration: duration } =
                        await getPeakData(file);
                    newAudioFiles.push({
                        url: audioObjectUrl,
                        duration,
                        name: fileName,
                        peakData,
                    });
                } catch (error) {
                    console.error('Error getting audio data:', error);
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
                        <AudioItem
                            key={index}
                            audioFile={audioFile}
                            index={index}
                            onRemove={onRemove}
                            fileList={fileList}
                        />
                    ))}
                </div>
            )}
        </React.Fragment>
    );
};

export default WaveAudioUpload;
