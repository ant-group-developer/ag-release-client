'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import useModalStore from '@/hooks/use-modal';
import ReleaseArtistModal from '@/modules/release-artist/components/modal/release-artist-modal';
import { useDeleteReleaseArtist } from '@/modules/release-artist/hooks/use-delete-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import ReleaseDetailForm from '@/modules/releases/components/release-detail/release-detail-form';
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { DeleteVariables } from '@/types/api';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function CoreDetail() {
    const messages = useTranslations();
    const params = useParams();
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ReleaseArtist);
    const closeModal = useModalStore((state) => state.closeModal);
    const { deleteReleaseArtist } = useDeleteReleaseArtist();

    const titleModalDelete = messages('delete.confirmTitle');
    const paragraphDelete = `${messages('delete.confirmMessage', { value: dataEdit?.artist?.name })}`;

    const handleRemoveArtistList = () => {
        const variables: DeleteVariables<ReleaseArtist['id']> = {
            id: dataEdit?.id,
        };
        deleteReleaseArtist(variables);
        closeModal();
    };

    return (
        <div>
            <ReleaseDetailForm />
            {(typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST ||
                typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST) && (
                <ReleaseArtistModal
                    isSetMainArtist={formValues?.releaseArtists?.length === 0}
                />
            )}

            {typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle={titleModalDelete}
                    paragraph={paragraphDelete}
                    onCancel={closeModal}
                    onOk={() => handleRemoveArtistList()}
                />
            )}
        </div>
    );
}
