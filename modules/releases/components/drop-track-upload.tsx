'use client';
import DndUpload from '@/components/ui/input/dnd-upload';
import { useTrackUpload } from '@/modules/releases/hooks/use-track-upload';
import { Progress, UploadProps } from 'antd';
import { useRef } from 'react';

interface Props extends UploadProps {}

export default function DropUploadTracks({ ...props }: Props) {
    const { uploadProgress, handleUpload } = useTrackUpload();
    const prevLength = useRef(0);

    return (
        <div>
            {uploadProgress?.length < 1 && (
                <DndUpload
                    {...props}
                    multiple
                    accept="audio/wav"
                    beforeUpload={() => false}
                    onChange={({ fileList }) => {
                        if (fileList.length > prevLength.current) {
                            handleUpload(fileList);
                        }
                        prevLength.current = fileList.length;
                    }}
                    maxCount={200}
                />
            )}

            {uploadProgress.map((p) => (
                <div key={p.key} className="mt-2 flex flex-col justify-start">
                    <span className="text-left">{p.fileName}</span>
                    <Progress
                        percent={p.progress}
                        size="small"
                        strokeColor={p.progress === 100 ? '#BFBFBF' : undefined}
                    />
                </div>
            ))}
        </div>
    );
}
