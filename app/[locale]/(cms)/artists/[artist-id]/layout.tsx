'use client';
import { Link } from '@/i18n/routing';
import { Tabs, TabsProps } from 'antd';
import { useParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default function layout({ children }: PropsWithChildren) {
    const params = useParams();
    const artistId = params['artist-id'];
    const items: TabsProps['items'] = [
        {
            key: 'overview',
            label: (
                <Link href={`/artists/${artistId}/overview`}>Tổng quan</Link>
            ),
        },
        {
            key: 'tracks',
            label: <Link href={`/artists/${artistId}/tracks`}>Bản nhạc</Link>,
        },
        {
            key: 'releases',
            label: <Link href={`/artists/${artistId}/releases`}>Bản nhạc</Link>,
        },
    ];

    return (
        <div>
            <div className="sticky top-0 z-10 bg-white">
                <div className="px-4">
                    <Tabs className="tab-release-detail" items={items} />
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
}
