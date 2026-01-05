import IconButton from '@/components/ui/button/icon-button';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { UpdateVariables } from '@/types/api';
import { Avatar, Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '../../enums';
import AddArtistContributorForm from './add-contributor-form';

type Props = AppTableProps<ReleaseArtist> & {
    disabled?: boolean;
};

export default function ReleaseContributorsTable({
    disabled = false,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((s) => s.openModal);

    const { updateReleaseArtist } = useUpdateReleaseArtist();

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
            title: messages('artist.addToTracks'),
            width: 130,
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
            title: messages('common.role'),
            width: 100,
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
                        />
                    </div>
                );
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
            title: messages('country.label'),
            width: 100,
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
            width: 40,
            align: 'center',
            render: (_, record, index) => {
                return (
                    <div onClick={(e) => e.preventDefault()}>
                        <IconButton
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST,
                                    record
                                )
                            }
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
                <div className="px-4 py-2">
                    <AddArtistContributorForm />
                </div>
            </div>
        </div>
    );
}
