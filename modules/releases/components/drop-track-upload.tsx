'use client';
import DndUpload from '@/components/ui/input/dnd-upload';
import { useTrackUpload } from '@/modules/releases/hooks/use-track-upload';
import { MAX_COUNT_UPLOAD_TRACK } from '@/modules/tracks/constants';
import { Progress, UploadProps } from 'antd';
import type { RcFile, UploadRequestOption } from 'rc-upload/lib/interface';
import { useRef } from 'react';

interface Props extends UploadProps {}

export default function DropUploadTracks({ ...props }: Props) {
    const { uploadProgress, handleUpload, pending } = useTrackUpload();
    const pendingRequestsRef = useRef<UploadRequestOption[]>([]);
    const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const flushUploadBatch = () => {
        if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
            flushTimerRef.current = null;
        }

        const requests = pendingRequestsRef.current;
        if (!requests.length || pending) return;

        pendingRequestsRef.current = [];

        handleUpload(
            requests.map((request) => {
                const file = request.file as RcFile;

                return {
                    uid: file.uid,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    originFileObj: file,
                };
            })
        )
            .then(() => {
                requests.forEach((request) => request.onSuccess?.({}, request.file));
            })
            .catch((error) => {
                requests.forEach((request) => request.onError?.(error));
            });
    };

    const customRequest = (options: UploadRequestOption) => {
        pendingRequestsRef.current.push(options);

        if (flushTimerRef.current) {
            clearTimeout(flushTimerRef.current);
        }

        flushTimerRef.current = setTimeout(flushUploadBatch, 0);
    };

    return (
        <div>
            {uploadProgress?.length < 1 && (
                <DndUpload
                    {...props}
                    multiple
                    accept="audio/wav"
                    customRequest={customRequest}
                    showUploadList={false}
                    maxCount={MAX_COUNT_UPLOAD_TRACK}
                    disabled={pending || props.disabled}
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
