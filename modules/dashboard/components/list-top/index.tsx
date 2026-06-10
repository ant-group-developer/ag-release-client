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
        { label: messages('release.label'), value: 'release' },
        { label: messages('track.label'), value: 'track' },
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
                            { id: 2, name: 'Quiet Storm', total: 812005 },
                        ]}
                    />
                );
        }
    };

    return (
        <Card
            className={`flex h-full w-full flex-col overflow-hidden rounded-lg ${className}`}
            styles={{
                header: { borderBottom: 0, paddingBottom: 0, paddingTop: 24 },
                body: {
                    padding: '0 24px',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                },
            }}
            title={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-md m-0 font-bold">Top Performance</h3>
                    <Segmented
                        options={tabOptions}
                        value={activeTab}
                        onChange={(value) => setActiveTab(value as string)}
                    />
                </div>
            }
        >
            <div className="mt-6 flex-1">{renderTable()}</div>
        </Card>
    );
}
