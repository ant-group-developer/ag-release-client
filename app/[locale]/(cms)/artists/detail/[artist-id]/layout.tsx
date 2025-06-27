'use client';
import { SIZE_ICON } from '@/constants/common';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { Button, Tabs, TabsProps } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { PropsWithChildren, useEffect, useState } from 'react';

export default function ArtistDetailLayout({ children }: PropsWithChildren) {
    const params = useParams();
    const router = useRouter();
    const artistId = params['artist-id'];
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<string>(
        ARTIST_DETAIL_TABS.OVERVIEW
    );
    const items: TabsProps['items'] = [
        {
            key: ARTIST_DETAIL_TABS.OVERVIEW,
            label: (
                <Link className="pl-4 font-medium" href={`overview`}>
                    Tổng quan
                </Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.RELEASES,
            label: (
                <Link className="font-medium" href={`releases`}>
                    Phát hành
                </Link>
            ),
        },
        {
            key: ARTIST_DETAIL_TABS.TRACKS,
            label: (
                <Link className="font-medium" href={`tracks`}>
                    Bản nhạc
                </Link>
            ),
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

    return (
        <div>
            <div className="sticky top-0 z-10 bg-white">
                <div className="">
                    <Tabs
                        activeKey={activeTab}
                        className="tab-release-detail"
                        items={items}
                        tabBarExtraContent={{
                            right: (
                                <div className="pr-4">
                                    <Button
                                        shape="round"
                                        onClick={() => {
                                            router.push('/artists');
                                        }}
                                    >
                                        <ChevronLeft size={SIZE_ICON} />
                                        Danh sách nghệ sĩ
                                    </Button>
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>
            <div>{children}</div>
        </div>
    );
}
