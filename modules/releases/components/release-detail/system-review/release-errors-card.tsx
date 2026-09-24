'use client';

import { ReleaseEnrichedError } from '@/modules/releases/types';
import ReleaseErrorsTable from './release-errors-table';

interface ReleaseErrorsCardProps {
    releaseId?: string;
    releaseEnrichedErrorsData: ReleaseEnrichedError[];
    isFetchingEnrichedErrors: boolean;
}

export default function ReleaseErrorsCard({
    releaseEnrichedErrorsData,
    isFetchingEnrichedErrors,
}: ReleaseErrorsCardProps) {
    return (
        <ReleaseErrorsTable
            data={releaseEnrichedErrorsData}
            isLoading={isFetchingEnrichedErrors}
        />
    );
}
