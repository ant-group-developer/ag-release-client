import IconButton from '@/components/ui/button/icon-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/releases/types';
import { useDeleteTrackArtist } from '@/modules/track-artist/hooks/use-delete-track-artist';
import { TrackArtistData } from '@/modules/track-artist/types';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AddTrackArtistForm from './add-track-artist-form';

type Props = AppTableProps<TrackArtistData> & {
    trackData: TrackData;
    trackArtistData?: TrackArtistData;
};

export default function TrackArtistTable({ trackData, ...props }: Props) {
    // hooks
    // const { active, deActive, isActive } = useActive();
    const messages = useTranslations();
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // state
    const [deleteArtist, setDeleteArtist] = useState<{
        isOpen: boolean;
        trackArtistData?: TrackArtistData;
    }>({
        isOpen: false,
        trackArtistData: undefined,
    });

    // apis
    const { deleteTrackArtist } = useDeleteTrackArtist();
    // const { updateTrackArtist } = useUpdateTrackArtist();

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

    // const handleUpdateTrackArtist = (
    //     id: string,
    //     payload: UpdateTrackArtistPayload
    // ) => {
    //     const variables: UpdateVariables<
    //         ReleaseArtist['id'],
    //         UpdateTrackArtistPayload
    //     > = {
    //         id,
    //         payload: {
    //             ...payload,
    //         },
    //         onSuccess: () => {
    //             deActive();
    //         },
    //         onError: () => deActive(),
    //     };
    //     updateTrackArtist(variables);
    // };

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
        // {
        //     title: messages('common.role'),
        //     width: 100,
        //     render: (_, record, index) => {
        //         return (
        //             <div className="max-w-44">
        //                 <RoleArtistSelect
        //                     className="w-full"
        //                     defaultValue={record?.artistRole?.id}
        //                     onChange={() => {
        //                         handleUpdateTrackArtist(record?.id, {
        //                             artistRoleId: record?.artistRole?.id,
        //                         });
        //                     }}
        //                 />
        //             </div>
        //         );
        //     },
        // },
        {
            title: messages('country.label'),
            width: 150,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.country?.name}</span>;
            },
        },
        {
            title: messages('genre.label'),
            width: 150,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.genre?.name}</span>;
            },
        },
        {
            title: messages('artist.profiles'),
            width: 200,
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
                        <IconButton
                            disabled={isReadMode}
                            onClick={() => {
                                setDeleteArtist({
                                    isOpen: true,
                                    trackArtistData: record,
                                });
                            }}
                        >
                            <Trash color="red" size={SIZE_ICON} />
                        </IconButton>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="space-y-2">
            <div className="overflow-hidden rounded-lg border">
                <AppTable
                    {...props}
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                />

                {/* <TrackArtistModal
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
                /> */}

                <div className="px-4 py-2">
                    <AddTrackArtistForm trackData={trackData} />
                </div>

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
