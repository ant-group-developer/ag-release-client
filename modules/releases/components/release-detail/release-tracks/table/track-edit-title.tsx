import { showNotification } from '@/helpers/messages-helper';
import { TrackData } from '@/modules/releases/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { Input } from 'antd';
import { useEffect, useState } from 'react';

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
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={(e) => {
                    const value = e.target.value.trim();

                    if (value.length < 1) {
                        return showNotification(
                            'error',
                            messages('validation.min', {
                                number: 1,
                            })
                        );
                    }
                    if (value !== record.title) {
                        onUpdate({
                            id: record.id,
                            payload: { title: value },
                        });
                    }
                }}
            />
        </div>
    );
};
