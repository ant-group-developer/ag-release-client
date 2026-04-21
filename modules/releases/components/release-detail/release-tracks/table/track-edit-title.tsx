import { showNotification } from '@/helpers/messages-helper';
import { TrackData } from '@/modules/releases/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

export const EditableTitle = ({
    record,
    isReadMode,
    onUpdate,
    messages,
}: {
    record: TrackData;
    isReadMode: boolean;
    onUpdate: (variables: UpdateVariables<string, UpdateTrackPayload>) => void;
    messages: any;
}) => {
    const [localTitle, setLocalTitle] = useState(record.title);

    const debouncedUpdate = useMemo(() => {
        return debounce((id: string, title: string) => {
            onUpdate({
                id,
                payload: { title },
            });
        }, 800);
    }, [onUpdate]);

    useEffect(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

    useEffect(() => {
        setLocalTitle(record.title);
    }, [record.title]);

    return (
        <div className="space-y-2">
            <Input
                className="font-medium"
                size="small"
                value={localTitle}
                disabled={isReadMode}
                allowClear
                onChange={(e) => {
                    const value = e.target.value;
                    setLocalTitle(value);

                    if (value.length < 1) {
                        return showNotification(
                            'error',
                            messages('validation.min', {
                                number: 1,
                            })
                        );
                    }
                    if (value !== record.title) {
                        debouncedUpdate(record.id, value);
                    }
                }}
            />
        </div>
    );
};
