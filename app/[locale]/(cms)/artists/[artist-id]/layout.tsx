'use client';
import { Link } from '@/i18n/routing';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { Tabs, TabsProps } from 'antd';
import { useParams, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function layout({ children }: PropsWithChildren) {
    const params = useParams();
    const artistId = params['artist-id'];
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<string>(
        ARTIST_DETAIL_TABS.OVERVIEW
    );
    const items: TabsProps['items'] = [
        {
            key: ARTIST_DETAIL_TABS.OVERVIEW,
            label: (
                <Link className="pl-4" href={`/artists/${artistId}/overview`}>
                    Tổng quan
                </Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.RELEASES,
            label: (
                <Link href={`/artists/${artistId}/releases`}>Phát hành</Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.TRACKS,
            label: <Link href={`/artists/${artistId}/tracks`}>Bản nhạc</Link>,
        },
    ];

    useEffect(() => {
        // Cập nhật tab active khi đường dẫn thay đổi
        if (pathname) {
            if (pathname.includes('/overview')) {
                setActiveTab(ARTIST_DETAIL_TABS.OVERVIEW);
            } else if (pathname.includes('/releases')) {
                setActiveTab(ARTIST_DETAIL_TABS.RELEASES);
            } else if (pathname.includes('/tracks')) {
                setActiveTab(ARTIST_DETAIL_TABS.TRACKS);
            }
        }
    }, [pathname]);

    console.log(pathname);

    return (
        <div>
            <div className="sticky top-0 z-10 bg-white">
                <div className="">
                    <Tabs className="tab-release-detail" items={items} />
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
}
