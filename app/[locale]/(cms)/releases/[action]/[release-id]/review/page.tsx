'use client';
import MetadataInfo from '@/modules/releases/components/release-detail/release-review/metadata-info';
import ReviewProgress from '@/modules/releases/components/release-detail/release-review/review-progress';
import TracksInfo from '@/modules/releases/components/release-detail/release-review/tracks-info/page';
import { theme } from 'antd';

export default function Review() {
    const { token } = theme.useToken();
    return (
        <div className="my-4 flex flex-col gap-8">
            <ReviewProgress />

            <div
                className="grid grid-cols-2 gap-2 rounded-lg p-4"
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <MetadataInfo />
                <TracksInfo />
            </div>
        </div>
    );
}
