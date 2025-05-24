'use client';

import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import CreateArtistModal from '@/modules/artist/components/modal/create-artist';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import CreateLabelModal from '@/modules/label/components/modal/create-label';
import { TYPE_MODAL_LABEL } from '@/modules/label/enum';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CoreDetail() {
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const typeModal = useModalStore((state) => state.typeModal);

    useEffect(() => {
        // Chỉ set initialData nếu chưa có data trong store
        if (releaseId && Object.keys(formValues).length === 0) {
            // fake data
            const initialData = {
                type: 'album',
                nameRelease: 'Album Mới 2024',
                nameDisplay: 'Album Mới 2024 - Phát Hành Chính Thức',
                artist: 'artist-1',
                subArtist: ['artist-2'],
                genres: 'genre-1',
                subGenres: 'genre-2',
                language: 'vi',
                label: 'label-1',
                upc: '123456789012',
                catalogId: 'CAT-2024-001',
                copyRight: 'Công ty Âm nhạc XYZ',
                copyRight2: 'Bản quyền thuộc về XYZ Music',
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
            };
            setFormValues(initialData);
        }
    }, [releaseId, formValues, setFormValues]);

    return (
        <div>
            <ReleaseDetailForm />
            {typeModal === TYPE_MODAL_ARTIST.CREATE && <CreateArtistModal />}
            {typeModal === TYPE_MODAL_LABEL.CREATE && <CreateLabelModal />}
        </div>
    );
}
