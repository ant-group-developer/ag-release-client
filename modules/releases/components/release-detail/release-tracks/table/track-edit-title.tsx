import { showNotification } from '@/helpers/messages-helper';
import { TrackData } from '@/modules/releases/types';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
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
    onUpdate: (id: string, data: UpdateTrackPayload) => void;
    messages: any;
}) => {
    const [localTitle, setLocalTitle] = useState(record.title);

    useEffect(() => {
        setLocalTitle(record.title);
    }, [record.title]);

    return (
        <div className="space-y-2">
            <Input
                size="small"
                value={localTitle}
                disabled={isReadMode}
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
                        onUpdate(record.id, {
                            title: value,
                        });
                    }
                }}
            />
        </div>
    );
};
