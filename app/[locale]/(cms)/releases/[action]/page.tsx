'use client';

import useModalStore from '@/hooks/use-modal';
import CreateArtistModal from '@/modules/artist/components/modal/create-artist';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import CreateLabelModal from '@/modules/label/components/modal/create-label';
import { TYPE_MODAL_LABEL } from '@/modules/label/enum';
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

            {typeModal === TYPE_MODAL_ARTIST.CREATE && <CreateArtistModal />}
            {typeModal === TYPE_MODAL_LABEL.CREATE && <CreateLabelModal />}
        </div>
    );
}
