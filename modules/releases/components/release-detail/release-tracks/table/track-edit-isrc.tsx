'use client';
import { TrackData } from '@/modules/tracks/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

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
    const messages = useTranslations();

    const debouncedUpdate = useMemo(() => {
        return debounce((id: string, isrc: string) => {
            onUpdate({
                id,
                payload: { isrc },
            });
        }, 300);
    }, [onUpdate]);

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

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
                if (next !== record.isrc) {
                    debouncedUpdate(record.id, next);
                }
            }}
        />
    );
};
