'use client';
import CreateReleaseHeader from '@/modules/create-release/components/header';
import LeftSidebar from '@/modules/create-release/components/left-sidebar';
import CreateReleaseTabs from '@/modules/create-release/components/tabs';

type Props = {};

export default function CreateRelease({}: Props) {
    return (
        <div className="flex h-full">
            <LeftSidebar />
            <div className="flex-1 overflow-auto">
                <CreateReleaseHeader />
                <CreateReleaseTabs />
            </div>
        </div>
    );
}
