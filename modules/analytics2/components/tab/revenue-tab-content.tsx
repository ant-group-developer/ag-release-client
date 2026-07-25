'use client';

import { ANALYTICS_RELEASE_TYPE } from '../../enums';
import RevenueRankings from '../ranking/revenue-rankings';

interface Props {
    fromDate: string;
    toDate: string;
    releaseType: ANALYTICS_RELEASE_TYPE;
    sortBy?: string;
}

export default function RevenueTabContent({
    fromDate,
    toDate,
    releaseType,
    sortBy,
}: Props) {
    return (
        <>
            <RevenueRankings
                fromDate={fromDate}
                toDate={toDate}
                releaseType={releaseType}
                sortBy={sortBy}
            />
        </>
    );
}
