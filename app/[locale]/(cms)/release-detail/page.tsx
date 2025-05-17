'use client';
import ReleaseDetailHeader from '@/modules/release-detail/components/header';
import LeftSidebar from '@/modules/release-detail/components/right-sidebar';

type Props = {};

export default function ReleaseDetail({}: Props) {
    return (
        <div className="flex h-full">
            <LeftSidebar />
            <div className="flex-1 overflow-auto">
                <ReleaseDetailHeader />
            </div>
        </div>
    );
}
