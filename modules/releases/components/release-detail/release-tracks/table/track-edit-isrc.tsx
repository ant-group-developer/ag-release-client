import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { Input } from 'antd';
import { useEffect, useState } from 'react';

export const EditableIsrc = ({
    record,
    isReadMode,
    onUpdate,
}: {
    record: TrackData;
    isReadMode: boolean;
    onUpdate: (variables: UpdateVariables<string, UpdateTrackPayload>) => void;
}) => {
    const [localIsrc, setLocalIsrc] = useState(record.isrc ?? '');

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
            onChange={(e) => setLocalIsrc(e.target.value)}
            onBlur={(e) => {
                const value = e.target.value.trim();
                if (value !== (record.isrc ?? '')) {
                    onUpdate({
                        id: record.id,
                        payload: { isrc: value },
                    });
                }
            }}
        />
    );
};
