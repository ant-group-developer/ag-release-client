'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import AddArtistModal from '@/modules/artist/components/modal/add-artist';
import ArtistFormModal from '@/modules/artist/components/modal/create-artist';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import LabelFormModal from '@/modules/labels/components/modal/create-label';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import {
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { ReleaseFormValuesData } from '@/modules/releases/types';
import { GENRES } from '@/modules/tracks/enums';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CoreDetail() {
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);

    const handleRemoveArtistList = (artistId: string) => {
        const newArtistList = formValues?.artists?.filter(
            (artist: any) => artist.id !== artistId
        );
        setFormValues({ ...formValues, artists: newArtistList });
        closeModal();
    };

    const handleAddArtistRelease = (values: any) => {
        const isArtistEditModal =
            typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST;
        try {
            const newArtistData = {
                name: values.name,
                role: values.role,
                id: values.name,
            };
            const releaseArtists = formValues.artists || [];

            let updatedArtists;

            if (isArtistEditModal) {
                updatedArtists = releaseArtists.map((artist: any) =>
                    artist.name === dataEdit?.name
                        ? { ...artist, ...newArtistData }
                        : artist
                );
            } else {
                const isAlreadyHaveMainArtist = releaseArtists?.some(
                    (artist) => artist.role === newArtistData.role
                );

                if (isAlreadyHaveMainArtist) {
                    return (updatedArtists = [
                        newArtistData,
                        ...releaseArtists.filter(
                            (artist) => artist.role !== newArtistData.role
                        ),
                    ]);
                } else {
                    updatedArtists = [...releaseArtists, newArtistData];
                }
            }

            setFormValues({
                ...formValues,
                artists: updatedArtists,
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    useEffect(() => {
        // Chỉ set initialData nếu chưa có data trong store

        if (releaseId && (!formValues || !formValues.nameRelease)) {
            // fake data
            const initialData: ReleaseFormValuesData = {
                releaseType: RELEASES_TYPE.ALBUM,
                nameRelease: 'Album Mới 2024',
                isMoreThan4Artists: false,
                artists: [
                    {
                        id: 'Sơn Tùng MTP',
                        name: 'Sơn Tùng MTP',
                        role: 'Main Artist',
                    },
                ],
                genres: GENRES.HIP_HOP,
                subGenres: GENRES.HIP_HOP,
                label: 'ANT-MUSIC',
                upc: '123456789012',
                catalogId: 'CAT-2024-001',
                cLineYear: 'ANT-MUSIC',
                pLineYear: 'ANT-MUSIC',
                thumbnail: {
                    fileList: [
                        {
                            uid: '-1',
                            name: 'album-cover.jpg',
                            status: 'done',
                            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                            thumbUrl:
                                'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                        },
                    ],
                },
                version: '',
                metaDataLanguage: 'vi',
                tracks: [],
                releaseDate: '',
                timeZone: '',
                territory: undefined,
                platform: [],
                artistsApplyAllTracks: [],
            };
            setFormValues(initialData);
        }
    }, [releaseId, setFormValues]);

    return (
        <div>
            <ReleaseDetailForm />
            {(typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST ||
                typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST) && (
                <AddArtistModal
                    isSetMainArtist={formValues?.artists?.length === 0}
                    onSubmit={handleAddArtistRelease}
                />
            )}

            {typeModal === TYPE_MODAL_ARTIST.CREATE && <ArtistFormModal />}
            {typeModal === TYPE_MODAL_LABEL.CREATE && <LabelFormModal />}

            {typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle="Xóa nghệ sĩ"
                    paragraph="Bạn có chắc chắn muốn xóa nghệ sĩ ra khỏi phát hành này không?"
                    onCancel={closeModal}
                    onOk={() => handleRemoveArtistList(dataEdit.id)}
                />
            )}
        </div>
    );
}
