'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import { THEME } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { useThemeStore } from '@/hooks/use-theme-store';
import AddNewTrackModal from '@/modules/releases/components/release-detail/release-tracks/modal/add-new-track-modal';
import ReleaseTracksTable from '@/modules/releases/components/release-detail/release-tracks/table';
import {
    TYPE_MODAL_RELEASE,
    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST,
    TYPE_MODAL_TRACK,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import TrackArtistModal from '@/modules/track-artist/components/modal/track-artist-modal';
import { useDeleteTrackArtist } from '@/modules/track-artist/hooks/use-delete-track-artist';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TYPE_MODAL_TRACK_ARTIST } from '@/modules/tracks/enums';
import { useDeleteTrack } from '@/modules/tracks/hooks/use-delete-track';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData } from '@/modules/tracks/types';
import { getThemeConfig } from '@/theme/theme-config';
import { DeleteVariables } from '@/types/api';
import { Button, ConfigProvider } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';

export default function Tracks() {
    // hooks - state
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const typeModal = useModalStore((state) => state.typeModal);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const { theme: currentTheme, primaryColor } = useThemeStore();

    // apis
    const { tracksData, isLoading } = useGetListTracks({
        releaseId: formValues?.id as string,
        fieldOrder: 'order',
    });
    const { releaseData } = useGetDetailRelease(formValues?.id as string);
    const { deleteTrack } = useDeleteTrack();
    const { deleteTrackArtist } = useDeleteTrackArtist();

    // func
    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const handleRemoveTrack = () => {
        const variables: DeleteVariables<TrackData['id']> = {
            id: dataEdit.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteTrack(variables);
    };
    const handleRemoveTrackArtist = () => {
        const variable: DeleteVariables<TrackArtistData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => closeModal(),
        };
        deleteTrackArtist(variable);
    };

    // const
    const isShowAddTrack =
        tracksData?.items?.length < releaseData?.albumFormat?.maxTrackCount;
    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };
    const themeConfig = getThemeConfig(currentTheme, primaryColor as string);
    const customTheme = {
        token: {
            ...themeConfig.token,
            colorBgContainerDisabled:
                currentTheme == THEME.LIGHT ? '#fff' : '#2a2a2a',
        },
    };

    useEffect(() => {
        if (tracksData?.items) {
            setFormValues({
                ...formValues,
                tracks: tracksData.items.map((track) => ({
                    ...track,
                    isSensitiveContent: !!track.isSensitiveContent,
                })),
            });
        }
    }, [tracksData?.items]);

    return (
        <ConfigProvider theme={customTheme}>
            <div className="relative">
                <ReleaseTracksTable
                    dataSource={tracksData?.items}
                    // rowSelection={rowSelection}
                    loading={isLoading}
                />

                {typeModal === TYPE_MODAL_RELEASE.ADD_TRACK && (
                    <AddNewTrackModal />
                )}

                {/* On checking to delete */}
                {/* {(typeModal === TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST ||
                    typeModal ===
                        TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.EDIT_ARTIST) && (
                    <ReleaseArtistModal isSetMainArtist />
                )} */}

                {(typeModal === TYPE_MODAL_TRACK_ARTIST.ADD ||
                    typeModal === TYPE_MODAL_TRACK_ARTIST.UPDATE) && (
                    <TrackArtistModal />
                )}

                {typeModal ===
                    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={'Are you sure you want to delete ?'}
                        onCancel={closeModal}
                        onOk={() => {}}
                    />
                )}

                {typeModal === TYPE_MODAL_TRACK_ARTIST.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.artist?.name,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleRemoveTrackArtist()}
                    />
                )}

                {typeModal === TYPE_MODAL_TRACK.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.title,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleRemoveTrack()}
                    />
                )}

                {isShowAddTrack && (
                    <div className="absolute right-2 top-[-2.5rem] z-50">
                        <Button
                            onClick={() =>
                                openModal(TYPE_MODAL_RELEASE.ADD_TRACK)
                            }
                            type="primary"
                        >
                            {messages('tracks.add')}
                        </Button>
                    </div>
                )}
            </div>
        </ConfigProvider>
    );
}
