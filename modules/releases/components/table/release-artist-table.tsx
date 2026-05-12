import IconButton from '@/components/ui/button/icon-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { ArtistProfileData } from '@/modules/artist/types';
import { useDeleteReleaseArtist } from '@/modules/release-artist/hooks/use-delete-release-artist';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { DeleteVariables, UpdateVariables } from '@/types/api';
import { Avatar, Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = AppTableProps<ReleaseArtist> & {
    disabled?: boolean;
};

export default function ReleaseArtistTable({
    disabled = false,
    ...props
}: Props) {
    const [releaseArtistModal, setReleaseArtistModal] = useState<{
        data?: ReleaseArtist;
        isOpen: boolean;
    }>();
    const messages = useTranslations();

    // const openModal = useModalStore((s) => s.openModal);

    const { updateReleaseArtist } = useUpdateReleaseArtist();

    const { deleteReleaseArtist } = useDeleteReleaseArtist();

    const handleRemoveArtistList = () => {
        const variables: DeleteVariables<ReleaseArtist['id']> = {
            id: releaseArtistModal?.data?.id as string,
            onSuccess: () => {
                setReleaseArtistModal({
                    data: undefined,
                    isOpen: false,
                });
            },
        };
        deleteReleaseArtist(variables);
    };

    const handleUpdate = (
        releaseArtistId: ReleaseArtist['id'],
        payload: UpdateReleaseArtistPayload
    ) => {
        const variables: UpdateVariables<
            ReleaseArtist['id'],
            UpdateReleaseArtistPayload
        > = {
            id: releaseArtistId,
            payload,
        };
        updateReleaseArtist(variables);
    };

    const columns: ColumnType<ReleaseArtist>[] = [
        {
            title: messages('common.iNo'),
            render: (_, __, index) => (index += 1),
            align: 'center',
            width: 50,
        },
        {
            title: messages('common.name'),
            width: 400,
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
            title: messages('artist.addToTracks'),
            width: 200,
            render: (_, record, index) => {
                return (
                    <Switch
                        disabled={disabled}
                        onChange={(e) =>
                            handleUpdate(record?.id, {
                                addArtistToTracks: e,
                            })
                        }
                        defaultValue={record?.addArtistToTracks}
                    />
                );
            },
        },
        {
            title: messages('genre.label'),
            width: 200,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.genre?.name}</span>;
            },
        },
        {
            title: messages('country.label'),
            width: 200,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.country?.name}</span>;
            },
        },
        {
            title: messages('artist.profiles'),
            width: 150,
            render: (_, record, index) => {
                return (
                    <div className="space-x-1">
                        {record?.artist?.artistProfiles?.map(
                            (profile: ArtistProfileData) => (
                                <CustomTooltip
                                    key={profile.id}
                                    title={profile.dsp?.name}
                                >
                                    <Avatar
                                        size={'small'}
                                        src={profile.dsp?.picture ?? ''}
                                        className="cursor-pointer hover:opacity-80"
                                        onClick={(e) => {
                                            e?.stopPropagation();
                                            window.open(
                                                profile.url,
                                                '_blank',
                                                'noopener'
                                            );
                                        }}
                                    >
                                        {profile.dsp?.name?.[0]}
                                    </Avatar>
                                </CustomTooltip>
                            )
                        )}
                    </div>
                );
            },
        },
        {
            width: 50,
            align: 'center',
            render: (_, record, index) => {
                return (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {!disabled && (
                            <IconButton
                                disabled={disabled}
                                onClick={() => {
                                    setReleaseArtistModal({
                                        isOpen: true,
                                        data: record,
                                    });
                                }}
                            >
                                <Trash color="red" size={SIZE_ICON} />
                            </IconButton>
                        )}
                    </div>
                );
            },
        },
    ];
    return (
        <div className="space-y-2">
            <div className="overflow-hidden rounded-lg border border-b-0 dark:border-zinc-700">
                <AppTable
                    {...props}
                    columns={columns}
                    // scroll={{ x: 'max-content' }}
                />
                {!disabled && (
                    <div>
                        <AppConfirm
                            open={releaseArtistModal?.isOpen}
                            modalTitle={messages('delete.confirmTitle')}
                            paragraph={messages('action.delete.alert', {
                                label: releaseArtistModal?.data?.artist?.name,
                            })}
                            onCancel={() => {
                                setReleaseArtistModal({
                                    isOpen: false,
                                    data: undefined,
                                });
                            }}
                            onOk={() => handleRemoveArtistList()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
