'use client';
import useModalStore from '@/hooks/use-modal';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import AddReleaseArtistModal from '@/modules/release-artist/components/modal/release-artist-modal';
import ReleaseDetailForm from '@/modules/releases/components/release-detail/release-detail-form';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
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
        // const newArtistList = formValues?.artists?.filter(
        //     (artist: any) => artist.id !== artistId
        // );
        // setFormValues({ ...formValues, artists: newArtistList });
        // closeModal();
    };

    useEffect(() => {
        resetFormValues();
    }, []);

    return (
        <div>
            <ReleaseDetailForm />

            {(typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST ||
                typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST) && (
                <AddReleaseArtistModal
                    isSetMainArtist={formValues?.releaseArtists?.length === 0}
                />
            )}

            {typeModal === TYPE_MODAL_ARTIST.CREATE && <ArtistFormModal />}
            {typeModal === TYPE_MODAL_LABEL.CREATE && <LabelFormModal />}

            {/* {typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle="Xóa nghệ sĩ"
                    paragraph="Bạn có chắc chắn muốn xóa nghệ sĩ ra khỏi phát hành này không?"
                    onCancel={closeModal}
                    onOk={() => handleRemoveArtistList(dataEdit.id)}
                />
            )} */}
        </div>
    );
}
