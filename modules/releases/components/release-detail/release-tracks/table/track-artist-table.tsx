import ActionButton from '@/components/ui/button/action-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { TrackData } from '@/modules/releases/types';
import TrackArtistModal from '@/modules/track-artist/components/modal/track-artist-modal';
import { useDeleteTrackArtist } from '@/modules/track-artist/hooks/use-delete-track-artist';
import { TrackArtistData } from '@/modules/track-artist/types';
import { Avatar, Button } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = AppTableProps<TrackArtistData> & {
    trackData: TrackData;
};

export default function TrackArtistTable({ trackData, ...props }: Props) {
    const messages = useTranslations();
    const [artistForm, setArtistForm] = useState<{
        isOpen: boolean;
        trackData?: TrackData;
        trackArtistData?: TrackArtistData;
    }>({
        isOpen: false,
        trackData: undefined,
        trackArtistData: undefined,
    });
    const [deleteArtist, setDeleteArtist] = useState<{
        isOpen: boolean;
        trackArtistData?: TrackArtistData;
    }>({
        isOpen: false,
        trackArtistData: undefined,
    });

    const { deleteTrackArtist } = useDeleteTrackArtist();

    const handleRemoveTrackArtist = () => {
        const variable = {
            trackId: trackData?.id,
            id: deleteArtist?.trackArtistData?.id as string,
            onSuccess: () =>
                setDeleteArtist({
                    isOpen: false,
                    trackArtistData: undefined,
                }),
        };
        deleteTrackArtist(variable);
    };

    const handleOpenArtistForm = ({
        isOpen,
        trackData,
        trackArtistData,
    }: {
        isOpen: boolean;
        trackData?: TrackData;
        trackArtistData?: TrackArtistData;
    }) => {
        setArtistForm({
            isOpen,
            trackData: trackData ?? undefined,
            trackArtistData: trackArtistData ?? undefined,
        });
    };

    const columns: ColumnType<TrackArtistData>[] = [
        {
            title: messages('common.iNo'),
            render: (_, __, index) => (index += 1),
            align: 'center',
            width: 50,
        },
        {
            title: messages('common.name'),
            width: 300,
            render: (_, record, index) => {
                const artist = record?.artist;
                return (
                    <div className="flex gap-2">
                        <Avatar src={artist?.picture}>{artist?.name[0]}</Avatar>
                        <span>{artist?.name}</span>
                    </div>
                );
            },
        },
        {
            title: messages('common.role'),
            width: 100,
            render: (_, record, index) => {
                return <span>{record?.artistRole?.name}</span>;
            },
        },
        {
            title: messages('country.label'),
            width: 100,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.country?.name}</span>;
            },
        },
        {
            title: messages('genre.label'),
            width: 100,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.genre?.name}</span>;
            },
        },
        {
            title: messages('artist.profiles'),
            width: 150,
            render: (_, record, index) => {
                return (
                    <div className="space-x-2">
                        {/* <Avatar
                            size={28}
                            src="/icon/apple-music.svg"
                            className="hover:cursor-pointer hover:opacity-40"
                            onClick={(e) => {
                                e?.stopPropagation();
                                window.open(
                                    'https://open.spotify.com/',
                                    '_blank',
                                    'noopener'
                                );
                            }}
                        /> */}
                    </div>
                );
            },
        },
        {
            width: 50,
            align: 'center',
            render: (_, record, index) => {
                return (
                    <div onClick={(e) => e.preventDefault()}>
                        <ActionButton
                            showDelete
                            showUpdate
                            onShowDelete={() =>
                                setDeleteArtist({
                                    isOpen: true,
                                    trackArtistData: record,
                                })
                            }
                            onShowUpdate={() => {
                                handleOpenArtistForm({
                                    isOpen: true,
                                    trackArtistData: record,
                                    trackData: trackData,
                                });
                            }}
                        />
                    </div>
                );
            },
        },
    ];
    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <Button
                    onClick={() =>
                        handleOpenArtistForm({
                            isOpen: true,
                            trackData: trackData,
                        })
                    }
                    type="primary"
                >
                    {messages('artist.add')}
                </Button>
            </div>
            <div className="overflow-hidden rounded-lg border">
                <AppTable
                    {...props}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                />

                <TrackArtistModal
                    open={artistForm.isOpen}
                    onCancel={() =>
                        handleOpenArtistForm({
                            isOpen: false,
                        })
                    }
                    trackData={artistForm?.trackData}
                    trackArtistData={artistForm?.trackArtistData}
                    setCloseModal={() => {
                        handleOpenArtistForm({
                            isOpen: false,
                        });
                    }}
                />

                <AppConfirm
                    open={deleteArtist.isOpen}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: deleteArtist?.trackArtistData?.artist?.name,
                    })}
                    onCancel={() =>
                        setDeleteArtist({
                            isOpen: false,
                            trackArtistData: undefined,
                        })
                    }
                    onOk={() => handleRemoveTrackArtist()}
                />
            </div>
        </div>
    );
}
