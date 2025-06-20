'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore from '@/hooks/use-modal';
import AddArtistModal from '@/modules/artist/components/modal/add-artist';
import ArtistFormModal from '@/modules/artist/components/modal/create-artist';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import LabelFormModal from '@/modules/labels/components/modal/create-label';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { useEffect } from 'react';

export default function CoreDetailCreate() {
    const typeModal = useModalStore((state) => state.typeModal);
    const resetFormValues = useReleaseFormStore(
        (state) => state.resetFormValues
    );
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);

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
                updatedArtists = [...releaseArtists, newArtistData];
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
        resetFormValues();
    }, []);

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
