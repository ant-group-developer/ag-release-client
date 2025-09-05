import { useTranslations } from 'next-intl';
import StatCard from './stat-card';

type Props = {};

export default function StatsOverview({}: Props) {
    const messages = useTranslations();

    const issuesCard = {
        title: 'Issues',
        value: '15',
        trend: 32.4,
        data: [
            { date: '2025-01-01', value: 12 },
            { date: '2025-01-02', value: 18 },
            { date: '2025-01-03', value: 15 },
            { date: '2025-01-04', value: 20 },
            { date: '2025-01-05', value: 22 },
            { date: '2025-01-06', value: 25 },
            { date: '2025-01-07', value: 28 },
            { date: '2025-01-08', value: 30 },
            { date: '2025-01-09', value: 26 },
            { date: '2025-01-10', value: 29 },
            { date: '2025-01-11', value: 31 },
            { date: '2025-01-12', value: 33 },
        ],
    };

    const whiteLabelCard = {
        title: 'White label/Label',
        value: '8',
        trend: 18.45,
        data: [
            { date: '2025-01-01', value: 5 },
            { date: '2025-01-02', value: 8 },
            { date: '2025-01-03', value: 6 },
            { date: '2025-01-04', value: 10 },
            { date: '2025-01-05', value: 7 },
            { date: '2025-01-06', value: 12 },
            { date: '2025-01-07', value: 9 },
            { date: '2025-01-08', value: 14 },
            { date: '2025-01-09', value: 11 },
            { date: '2025-01-10', value: 15 },
            { date: '2025-01-11', value: 13 },
            { date: '2025-01-12', value: 16 },
        ],
    };

    const releasesCard = {
        title: 'Releases',
        value: '10',
        trend: -20.34,
        data: [
            { date: '2025-01-01', value: 15 },
            { date: '2025-01-02', value: 20 },
            { date: '2025-01-03', value: 25 },
            { date: '2025-01-04', value: 30 }, // đỉnh
            { date: '2025-01-05', value: 28 },
            { date: '2025-01-06', value: 24 },
            { date: '2025-01-07', value: 20 },
            { date: '2025-01-08', value: 18 },
            { date: '2025-01-09', value: 14 },
            { date: '2025-01-10', value: 12 },
            { date: '2025-01-11', value: 10 },
            { date: '2025-01-12', value: 8 },
        ],
    };

    const tracksCard = {
        title: 'Tracks',
        value: '32',
        trend: 14.45,
        data: [
            { date: '2025-01-01', value: 10 },
            { date: '2025-01-02', value: 15 },
            { date: '2025-01-03', value: 22 }, // đỉnh 1
            { date: '2025-01-04', value: 18 },
            { date: '2025-01-05', value: 12 },
            { date: '2025-01-06', value: 20 },
            { date: '2025-01-07', value: 28 }, // đỉnh 2
            { date: '2025-01-08', value: 25 },
            { date: '2025-01-09', value: 19 },
            { date: '2025-01-10', value: 24 },
            { date: '2025-01-11', value: 30 }, // đỉnh nhỏ
            { date: '2025-01-12', value: 26 },
        ],
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
            <StatCard
                title="Issues"
                value="15"
                trend={32.4}
                data={issuesCard.data}
            />

            <StatCard
                title="White label/Label"
                value="8"
                trend={18.45}
                data={whiteLabelCard.data}
            />

            <StatCard
                title="Releases"
                value="10"
                trend={-20.34}
                data={releasesCard.data}
            />

            <StatCard
                title="Tracks"
                value="32"
                trend={14.45}
                data={tracksCard.data}
            />
        </div>
    );
}
