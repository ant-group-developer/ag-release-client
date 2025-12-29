import ActionButton from '@/components/ui/button/action-button';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import useModalStore from '@/hooks/use-modal';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { UpdateVariables } from '@/types/api';
import { Avatar, Button, Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '../../enums';

type Props = AppTableProps<ReleaseArtist> & {
    disabled?: boolean;
};

export default function ReleaseArtistTable({
    disabled = false,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((s) => s.openModal);

    const { updateReleaseArtist } = useUpdateReleaseArtist();

    const handleApplyAllTracks = (
        releaseArtistId: ReleaseArtist['id'],
        isAddArtistToTracks: boolean
    ) => {
        const variables: UpdateVariables<
            ReleaseArtist['id'],
            UpdateReleaseArtistPayload
        > = {
            id: releaseArtistId,
            payload: {
                addArtistToTracks: isAddArtistToTracks,
            },
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
                        onChange={(e) => handleApplyAllTracks(record?.id, e)}
                        defaultValue={record?.addArtistToTracks}
                    />
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
                        {!disabled && (
                            <ActionButton
                                showDelete
                                showUpdate
                                onShowDelete={() =>
                                    openModal(
                                        TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST,
                                        record
                                    )
                                }
                                onShowUpdate={() => {
                                    openModal(
                                        TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST,
                                        record
                                    );
                                }}
                            />
                        )}
                    </div>
                );
            },
        },
    ];
    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <Button
                    disabled={disabled}
                    onClick={() =>
                        openModal(TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST)
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
            </div>
        </div>
    );
}
