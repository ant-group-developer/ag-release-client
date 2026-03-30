'use client';
import MetadataInfo from '@/modules/releases/components/release-detail/release-review/metadata-info';
import ReviewInfor from '@/modules/releases/components/release-detail/release-review/review-progress';
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
        <div className="mb-4 flex flex-col gap-4">
            <ReviewInfor />

            <div
                className="rounded-lg"
                style={{
                    backgroundColor: token?.colorBgContainer,
                }}
            >
                <Tabs items={tabItems} className="!px-4 !pb-4" />
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
