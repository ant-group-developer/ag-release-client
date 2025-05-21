'use client';

import { useRouter } from '@/i18n/routing';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Button } from 'antd';
import { useParams } from 'next/navigation';

export default function CoreDetail() {
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const fakeIdRelease = releaseId;
    const form = useReleaseFormStore((state) => state.form);

    if (releaseId) {
        // Khởi tạo dữ liệu ban đầu cho form
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
            coppyRight: 'Công ty Âm nhạc XYZ',
            coppyRight2: 'Bản quyền thuộc về XYZ Music',
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

        // Áp dụng dữ liệu ban đầu vào form
        form?.setFieldsValue(initialData);
    }

    const handleSubmit = async () => {
        try {
            const values = await form?.validateFields();

            router.push(`/releases/detail/${fakeIdRelease}/core-detail`);
        } catch (error) {
            console.error('Lỗi khi xác thực form:', error);
        }
    };

    return (
        <div>
            {form && <ReleaseDetailForm form={form} />}

            <div className="flex justify-end p-4">
                <Button type="primary" onClick={handleSubmit}>
                    Lưu thông tin
                </Button>
            </div>
        </div>
    );
}
