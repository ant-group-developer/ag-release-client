'use client';
import { useGenerateIsrc } from '@/modules/tracks/hooks/use-generate-isrc';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { BarcodeOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const EditableIsrc = ({
    record,
    isReadMode,
    onUpdate,
}: {
    record: TrackData;
    isReadMode: boolean;
    onUpdate: (id: string, data: UpdateTrackPayload) => void;
}) => {
    const [localIsrc, setLocalIsrc] = useState(record.isrc ?? '');
    const messages = useTranslations();
    const { generateIsrc } = useGenerateIsrc();

    useEffect(() => {
        setLocalIsrc(record.isrc ?? '');
    }, [record.isrc]);

    return (
        <Input
            variant="filled"
            disabled={isReadMode}
            size="small"
            allowClear
            value={localIsrc}
            onChange={(e) => {
                const next = e.target.value;
                setLocalIsrc(next);
                onUpdate(record.id, { isrc: next });
            }}
            suffix={
                !localIsrc && (
                    <span onClick={() => {}}>
                        <BarcodeOutlined className="mr-1" />
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => {
                                generateIsrc({
                                    trackId: record?.id,
                                    onSuccess(e) {
                                        console.log(e);
                                    },
                                });
                            }}
                        >
                            {messages('common.generate')}
                        </span>
                    </span>
                )
            }
        />
    );
};
