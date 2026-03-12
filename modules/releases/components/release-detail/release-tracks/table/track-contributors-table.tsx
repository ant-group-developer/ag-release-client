import IconButton from '@/components/ui/button/icon-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useActive } from '@/hooks/use-active';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { ReleaseContributor } from '@/modules/release-contributor/types';
import { TrackData } from '@/modules/releases/types';
import { useDeleteTrackContributor } from '@/modules/track-contributor/hooks/use-delete-track-contributor';
import { useUpdateTrackContributor } from '@/modules/track-contributor/hooks/use-update-track-contributor';
import { TrackContributorData } from '@/modules/track-contributor/types';
import { UpdateTrackContributorPayload } from '@/modules/track-contributor/types/payload';
import { UpdateVariables } from '@/types/api';
import { Avatar } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AddTrackContributorForm from './add-track-contributor-form';

type Props = AppTableProps<TrackContributorData> & {
    trackData: TrackData;
    trackArtistData?: TrackContributorData;
};

export default function TrackContributorsTable({ trackData, ...props }: Props) {
    // hooks
    const { active, deActive, isActive } = useActive();
    const messages = useTranslations();
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // state
    const [deleteContributor, setDeleteContributor] = useState<{
        isOpen: boolean;
        trackContributorData?: TrackContributorData;
    }>({
        isOpen: false,
        trackContributorData: undefined,
    });

    // apis
    const { deleteTrackContributor } = useDeleteTrackContributor();
    const { updateTrackContributor } = useUpdateTrackContributor();

    const handleRemoveTrackContributor = () => {
        const variable = {
            trackId: trackData?.id,
            id: deleteContributor?.trackContributorData?.id as string,
            onSuccess: () =>
                setDeleteContributor({
                    isOpen: false,
                    trackContributorData: undefined,
                }),
        };
        deleteTrackContributor(variable);
    };

    const handleUpdateTrackContributor = (
        id: string,
        payload: UpdateTrackContributorPayload
    ) => {
        active();
        const variables: UpdateVariables<
            ReleaseContributor['id'],
            UpdateTrackContributorPayload
        > = {
            id,
            payload: {
                ...payload,
            },
            onSuccess: () => {
                deActive();
            },
            onError: () => deActive(),
        };
        updateTrackContributor(variables);
    };

    const columns: ColumnType<TrackContributorData>[] = [
        {
            title: messages('common.iNo'),
            render: (_, __, index) => (index += 1),
            align: 'center',
            width: 50,
        },
        {
            title: messages('common.name'),
            width: 250,
            render: (_, record, index) => {
                const artist = record?.artist;
                return (
                    <div className="flex items-center gap-2">
                        <Avatar src={artist?.picture}>{artist?.name[0]}</Avatar>
                        <span>{artist?.name}</span>
                    </div>
                );
            },
        },
        {
            title: messages('common.role'),
            width: 150,
            render: (_, record, index) => {
                return (
                    <div className="max-w-44">
                        <RoleArtistSelect
                            disabled={isActive || isReadMode}
                            className="w-full"
                            defaultValue={record?.artistRole?.id}
                            onChange={() => {
                                handleUpdateTrackContributor(record?.id, {
                                    artistRoleId: record?.artistRole?.id,
                                });
                            }}
                        />
                    </div>
                );
            },
        },
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
                        <IconButton
                            disabled={isReadMode || isActive}
                            onClick={() => {
                                setDeleteContributor({
                                    isOpen: true,
                                    trackContributorData: record,
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
            <div className="overflow-hidden rounded-lg border dark:border-zinc-700">
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
                    <AddTrackContributorForm trackData={trackData} />
                </div>

                <AppConfirm
                    open={deleteContributor.isOpen}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: deleteContributor?.trackContributorData?.artist
                            ?.name,
                    })}
                    onCancel={() =>
                        setDeleteContributor({
                            isOpen: false,
                            trackContributorData: undefined,
                        })
                    }
                    onOk={() => handleRemoveTrackContributor()}
                />
            </div>
        </div>
    );
}
