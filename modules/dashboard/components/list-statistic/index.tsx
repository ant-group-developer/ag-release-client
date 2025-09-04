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
            { name: 'P1', value: 12 },
            { name: 'P2', value: 18 },
            { name: 'P3', value: 15 },
            { name: 'P4', value: 20 },
            { name: 'P5', value: 22 },
            { name: 'P6', value: 25 },
            { name: 'P7', value: 28 },
            { name: 'P8', value: 30 },
            { name: 'P9', value: 26 },
            { name: 'P10', value: 29 },
            { name: 'P11', value: 31 },
            { name: 'P12', value: 33 },
        ],
    };

    const whiteLabelCard = {
        title: 'White label/Label',
        value: '8',
        trend: 18.45,
        data: [
            { name: 'P1', value: 5 },
            { name: 'P2', value: 7 },
            { name: 'P3', value: 8 },
            { name: 'P4', value: 6 },
            { name: 'P5', value: 9 },
            { name: 'P6', value: 10 },
            { name: 'P7', value: 12 },
            { name: 'P8', value: 11 },
            { name: 'P9', value: 14 },
            { name: 'P10', value: 15 },
            { name: 'P11', value: 13 },
            { name: 'P12', value: 16 },
        ],
    };

    const releasesCard = {
        title: 'Releases',
        value: '10',
        trend: -20.34,
        data: [
            { name: 'P1', value: 30 },
            { name: 'P2', value: 28 },
            { name: 'P3', value: 25 },
            { name: 'P4', value: 27 },
            { name: 'P5', value: 24 },
            { name: 'P6', value: 22 },
            { name: 'P7', value: 20 },
            { name: 'P8', value: 18 },
            { name: 'P9', value: 16 },
            { name: 'P10', value: 14 },
            { name: 'P11', value: 12 },
            { name: 'P12', value: 10 },
        ],
    };

    const tracksCard = {
        title: 'Tracks',
        value: '32',
        trend: 14.45,
        data: [
            { name: 'P1', value: 15 },
            { name: 'P2', value: 18 },
            { name: 'P3', value: 20 },
            { name: 'P4', value: 22 },
            { name: 'P5', value: 25 },
            { name: 'P6', value: 28 },
            { name: 'P7', value: 30 },
            { name: 'P8', value: 33 },
            { name: 'P9', value: 35 },
            { name: 'P10', value: 37 },
            { name: 'P11', value: 40 },
            { name: 'P12', value: 42 },
        ],
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
