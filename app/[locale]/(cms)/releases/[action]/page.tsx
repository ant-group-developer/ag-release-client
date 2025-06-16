'use client';

import useModalStore from '@/hooks/use-modal';
import ArtistFormModal from '@/modules/artist/components/modal/create-artist';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import LabelFormModal from '@/modules/labels/components/modal/create-label';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { useEffect } from 'react';

export default function CoreDetailCreate() {
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const typeModal = useModalStore((state) => state.typeModal);

    useEffect(() => {
        setFormValues({});
    }, [setFormValues]);

    return (
        <div>
            <ReleaseDetailForm />

            {(typeModal === TYPE_MODAL_ARTIST.CREATE ||
                typeModal === TYPE_MODAL_ARTIST.UPDATE) && <ArtistFormModal />}
            {typeModal === TYPE_MODAL_LABEL.CREATE && <LabelFormModal />}
        </div>
    );
}
