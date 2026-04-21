'use client';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { TrackData } from '@/modules/tracks/types';
import { Tag } from 'antd';
import { useTranslations } from 'next-intl';

export const TrackArtists = ({
    record,
    isReadMode,
    openModal,
}: {
    record: TrackData;
    isReadMode: boolean;
    openModal: (type: string, data?: any) => void;
}) => {
    const messages = useTranslations();
    return (
        <div>
            <div className="flex flex-wrap gap-y-2">
                {record?.trackArtists?.map((trackArtist: TrackArtistData) => (
                    <Tag
                        key={`${record.id}-${trackArtist.id}`}
                        closeIcon
                        onClick={() => {}}
                        onClose={(e) => {
                            e.preventDefault();
                            openModal(
                                TYPE_MODAL_TRACK_ARTIST.DELETE,
                                trackArtist
                            );
                        }}
                        closable={!isReadMode}
                        className="max-w-full whitespace-normal break-words"
                    >
                        {trackArtist?.artist?.name}
                    </Tag>
                ))}
                {!isReadMode && (
                    <Tag
                        key={`${record.id}-add-artist`}
                        className="cursor-pointer border-dashed hover:border-blue-500"
                        onClick={() => {
                            if (isReadMode) return;
                            openModal(TYPE_MODAL_TRACK_ARTIST.ADD, record);
                        }}
                    >
                        + {messages('artist.add')}
                    </Tag>
                )}
            </div>
        </div>
    );
};
