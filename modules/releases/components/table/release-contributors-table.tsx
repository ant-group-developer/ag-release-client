import IconButton from '@/components/ui/button/icon-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { ArtistProfileData } from '@/modules/artist/types';
import { useDeleteReleaseContributor } from '@/modules/release-contributor/hooks/use-delete-release-contributor';
import { useUpdateReleaseContributor } from '@/modules/release-contributor/hooks/use-update-release-contributor';
import { ReleaseContributor } from '@/modules/release-contributor/types';
import { UpdateReleaseContributorPayload } from '@/modules/release-contributor/types/payload';
import { DeleteVariables, UpdateVariables } from '@/types/api';
import { Avatar, Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AddArtistContributorForm from './add-contributor-form';

type Props = AppTableProps<ReleaseContributor> & {
    disabled?: boolean;
};

export default function ReleaseContributorsTable({
    disabled = false,
    ...props
}: Props) {
    const [releaseContributorModal, setReleaseContributorModal] = useState<{
        data?: ReleaseContributor;
        isOpen: boolean;
    }>();

    const messages = useTranslations();
    // const openModal = useModalStore((s) => s.openModal);

    const { updateReleaseContributor } = useUpdateReleaseContributor();

    const { deleteReleaseContributor } = useDeleteReleaseContributor();

    const handleRemoveArtistContributor = () => {
        const variables: DeleteVariables<ReleaseContributor['id']> = {
            id: releaseContributorModal?.data?.id as string,
            onSuccess: () => {
                setReleaseContributorModal({
                    data: undefined,
                    isOpen: false,
                });
            },
        };
        deleteReleaseContributor(variables);
    };

    const handleUpdate = (
        releaseContributorId: ReleaseContributor['id'],
        payload: UpdateReleaseContributorPayload
    ) => {
        const variables: UpdateVariables<
            ReleaseContributor['id'],
            UpdateReleaseContributorPayload
        > = {
            id: releaseContributorId,
            payload,
        };
        updateReleaseContributor(variables);
    };

    const columns: ColumnType<ReleaseContributor>[] = [
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
                    <div className="flex items-center gap-2">
                        <Avatar src={artist?.picture}>{artist?.name[0]}</Avatar>
                        <span>{artist?.name}</span>
                    </div>
                );
            },
        },
        {
            title: messages('artist.addToTracks'),
            width: 150,
            render: (_, record, index) => {
                return (
                    <Switch
                        disabled={disabled}
                        onChange={(e) =>
                            handleUpdate(record?.id, {
                                addContributorToTracks: e,
                            })
                        }
                        defaultValue={record?.addContributorToTracks}
                    />
                );
            },
        },
        {
            title: messages('common.role'),
            width: 200,
            render: (_, record, index) => {
                return (
                    <div className="max-w-52">
                        <RoleArtistSelect
                            defaultValue={record?.artistRole?.id}
                            className="w-full"
                            onChange={(e) =>
                                handleUpdate(record?.id, {
                                    artistRoleId: e,
                                })
                            }
                            disabled={disabled}
                            variant="borderless"
                        />
                    </div>
                );
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
            title: messages('country.label'),
            width: 150,
            render: (_, record, index) => {
                const artist = record?.artist;
                return <span>{artist?.country?.name}</span>;
            },
        },

        {
            title: messages('artist.profiles'),
            width: 120,
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
                                        size={26}
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
                                        {profile.dsp?.name[0]}
                                    </Avatar>
                                </CustomTooltip>
                            )
                        )}
                    </div>
                );
            },
        },
        {
            width: 40,
            align: 'center',
            render: (_, record, index) => {
                return (
                    <div onClick={(e) => e.preventDefault()}>
                        {!disabled && (
                            <IconButton
                                onClick={() => {
                                    setReleaseContributorModal({
                                        isOpen: true,
                                        data: record,
                                    });
                                }}
                                disabled={disabled}
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
                    scroll={{ x: 'max-content' }}
                />
                {!disabled && (
                    <div className="px-4">
                        <AddArtistContributorForm disabled={disabled} />
                        <AppConfirm
                            open={releaseContributorModal?.isOpen}
                            modalTitle={messages('delete.confirmTitle')}
                            paragraph={messages('delete.confirmMessage', {
                                value: releaseContributorModal?.data?.artist
                                    ?.name,
                            })}
                            onCancel={() => {
                                setReleaseContributorModal({
                                    isOpen: false,
                                    data: undefined,
                                });
                            }}
                            onOk={() => handleRemoveArtistContributor()}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
