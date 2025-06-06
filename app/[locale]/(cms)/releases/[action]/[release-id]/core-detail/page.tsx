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
import { TYPE_MODAL_RELEASE_ARTIST_LIST } from '@/modules/releases/enums';
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
    const dataEdit = useModalStore((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);

    const handleRemoveArtistList = (artistId: string) => {
        const newArtistList = formValues.artists.filter(
            (artist: any) => artist.id !== artistId
        );
        setFormValues({ ...formValues, artists: newArtistList });
        closeModal();
    };

    useEffect(() => {
        // Chỉ set initialData nếu chưa có data trong store

        if (releaseId && (!formValues || !formValues.nameRelease)) {
            // fake data
            const initialData = {
                type: 'album',
                nameRelease: 'Album Mới 2024',
                isMoreThan4Artists: false,
                nameDisplay: 'Album Mới 2024 - Phát Hành Chính Thức',
                artists: [
                    {
                        id: 'Sơn Tùng MTP',
                        name: 'Sơn Tùng MTP',
                        role: 'Main Artist',
                    },
                ],
                subArtist: ['artist-2'],
                genres: 'Hip-hop',
                subGenres: 'Rap',
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
            {(typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST ||
                typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST) && (
                <AddArtistModal />
            )}
            {typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle="Xóa nghệ sĩ"
                    paragraph="Bạn có chắc chắn muốn xóa nghệ sĩ này không?"
                    onOk={() => handleRemoveArtistList(dataEdit.id)}
                    onCancel={closeModal}
                />
            )}
            {typeModal === TYPE_MODAL_ARTIST.CREATE && <ArtistFormModal />}
            {typeModal === TYPE_MODAL_LABEL.CREATE && <LabelFormModal />}
        </div>
    );
}
