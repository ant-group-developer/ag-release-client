import { ORDER } from '@/enums/common';
import { Card, Segmented, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import TopStreamsTable from './top-streams-table';

type Props = {
    className?: string;
};

export default function ListTop({ className }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState<string>('track');

    const tabOptions = [
        { label: messages('track.label'), value: 'track' },
        { label: messages('release.label'), value: 'release' },
        { label: messages('artist.label'), value: 'artist' },
    ];

    const renderTable = () => {
        switch (activeTab) {
            case 'release':
                return (
                    <TopStreamsTable
                        dataFilter={{}}
                        orderByField={undefined}
                        orderField={ORDER.ASC}
                        pagination={{ pageSize: 10, current: 1 }}
                        dataSource={[
                            { id: 10, name: 'Aurora Nights', total: 1204502 },
                            { id: 5, name: 'Falling Leaves', total: 942100 },
                            { id: 2, name: 'Summer Breeze', total: 812005 },
                            { id: 7, name: 'City Lights', total: 750200 },
                            { id: 9, name: 'Wanderlust', total: 680300 },
                        ]}
                    />
                );
            case 'artist':
                return (
                    <TopStreamsTable
                        dataFilter={{}}
                        orderByField={undefined}
                        orderField={ORDER.ASC}
                        pagination={{ pageSize: 10, current: 1 }}
                        dataSource={[
                            { id: 2, name: 'Kai Nakamura', total: 5432100 },
                            { id: 7, name: 'Maya Santos', total: 4321000 },
                            { id: 5, name: 'Aiko Tanaka', total: 3210000 },
                            { id: 9, name: 'Hana Suzuki', total: 2100000 },
                            { id: 1, name: 'Luna Rivera', total: 1980000 },
                        ]}
                    />
                );
            default:
                return (
                    <TopStreamsTable
                        dataFilter={{}}
                        orderByField={undefined}
                        orderField={ORDER.ASC}
                        pagination={{ pageSize: 10, current: 1 }}
                        dataSource={[
                            { id: 10, name: 'Neon Horizons', total: 1204502 },
                            { id: 5, name: 'Midnight City', total: 942100 },
                            { id: 2, name: 'Quiet Storm', total: 812005 },
                            { id: 7, name: 'Starlight Echo', total: 750200 },
                            { id: 9, name: 'Electric Dreams', total: 680300 },
                        ]}
                    />
                );
        }
    };

    return (
        <Card
            className={`overflow-hidden rounded-lg border-0 shadow-sm ${className}`}
            styles={{
                header: { borderBottom: 0, paddingBottom: 0, paddingTop: 24 },
                body: { padding: '0 24px 24px 24px' },
            }}
            title={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="m-0 text-lg font-bold">Top Performance</h3>
                    <Segmented
                        options={tabOptions}
                        value={activeTab}
                        onChange={(value) => setActiveTab(value as string)}
                        className="rounded-full bg-gray-100 p-1 [&_.ant-segmented-item-selected]:rounded-full [&_.ant-segmented-item-selected]:text-purple-600 [&_.ant-segmented-item-selected]:shadow-none [&_.ant-segmented-thumb]:rounded-full"
                    />
                </div>
            }
        >
            <div className="mt-6">{renderTable()}</div>

            <div className="mt-8 flex justify-center">
                <button className="text-sm font-bold text-purple-600 transition-colors hover:text-purple-700">
                    View All {activeTab}s
                </button>
            </div>
        </Card>
    );
}
