'use client';
import MetadataInfo from '@/modules/releases/components/release-detail/release-review/metadata-info';
import ReviewProgress from '@/modules/releases/components/release-detail/release-review/review-progress';
import TracksInfo from '@/modules/releases/components/release-detail/release-review/tracks-info/page';
import { Tabs, theme } from 'antd';
import { useTranslations } from 'next-intl';

export default function Review() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const tabItems = [
        {
            label: 'Metadata',
            key: 'metadata',
            children: <MetadataInfo />,
        },
        {
            label: messages('common.tracks'),
            key: 'track',
            children: <TracksInfo />,
        },
    ];

    return (
        <div className="my-4 flex flex-col gap-8">
            <ReviewProgress />

            <div className="rounded-lg bg-white py-6">
                <Tabs items={tabItems} tabPosition="left" className="py-2" />
            </div>

            {/* <div
                className="grid grid-cols-2 gap-2 rounded-lg p-4"
                style={{ backgroundColor: token.colorBgContainer }}
            >
                <MetadataInfo />
                <TracksInfo />
            </div> */}
        </div>
    );
}
