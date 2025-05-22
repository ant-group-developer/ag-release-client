'use client';
import ListTracksReleaseHeader from '@/modules/release-detail/release-tracks/header';
import ReleaseTracksTable from '@/modules/release-detail/release-tracks/table';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { fakeTrackData } from '@/modules/tracks/constants/mockdata';
import { useParams } from 'next/navigation';
import { Key, useState } from 'react';

export default function Tracks() {
    const form = useReleaseFormStore((state) => state.form);
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const params = useParams();
    const releaseId = params['release-id'];
    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };

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

        // Áp dụng dữ liệu ban đầu vào form
        form?.setFieldsValue(initialData);
    }

    return (
        <div>
            <ListTracksReleaseHeader />
            <ReleaseTracksTable
                dataSource={fakeTrackData}
                rowSelection={rowSelection}
            />
        </div>
    );
}
