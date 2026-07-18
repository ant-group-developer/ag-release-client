'use client';
import { PATH_PARAMS } from '@/enums/routes';
import SubmitsTab from '@/modules/release-video/components/modal/submits-tab';
import { useParams } from 'next/navigation';

export default function SubmitsPage() {
    const params = useParams();
    const releaseId = params[PATH_PARAMS.RELEASE_ID] as string;

    return (
        <div className="flex h-full flex-col pb-4 pt-2">
            <SubmitsTab releaseId={releaseId} />
        </div>
    );
}
