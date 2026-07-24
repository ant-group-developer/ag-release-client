import { ANALYTICS_RELEASE_TYPE } from '../../enums';
import AnalyticsRankings from '../ranking/analytics-rankings';

interface Props {
    fromDate: string;
    toDate: string;
    releaseType: ANALYTICS_RELEASE_TYPE;
}

export default function PlaysTabContent({
    fromDate,
    toDate,
    releaseType,
}: Props) {
    return (
        <AnalyticsRankings
            fromDate={fromDate}
            toDate={toDate}
            releaseType={releaseType}
        />
    );
}
