import { Card, Timeline } from 'antd';

type UpdateItem = {
    id: string;
    title: string;
    description: string;
    time: string;
    isNew?: boolean;
};

const updates: UpdateItem[] = [
    {
        id: '1',
        title: 'Core Engine v2.4 Deployed',
        description:
            'Successfully patched memory leak issues in the aggregation layer. Global deployment completed in 4m 12s.',
        time: '10:45 AM',
        isNew: true,
    },
    {
        id: '2',
        title: 'New Compliance Policy',
        description:
            'Updated data retention protocols for EU-West regions. Automatic archival schedules are now live.',
        time: '09:12 AM',
    },
    {
        id: '3',
        title: 'Security Audit Passed',
        description:
            'Annual penetration test results received. No critical vulnerabilities identified. Score: 98/100.',
        time: 'YESTERDAY',
    },
    {
        id: '4',
        title: 'System Maintenance Scheduled',
        description:
            'Routine backup verification scheduled for Saturday, 02:00 UTC. No expected downtime for users.',
        time: 'YESTERDAY',
    },
];

export default function NewsUpdatedCard() {
    return (
        <Card
            className="overflow-hidden rounded-2xl border-0 shadow-sm"
            styles={{
                header: { borderBottom: 0, paddingBottom: 0, paddingTop: 24 },
            }}
            title={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h3 className="m-0 text-lg font-bold">
                            Recent Updates
                        </h3>
                    </div>
                </div>
            }
        >
            <div className="scrollbar-thin scrollbar-thumb-gray-200 max-h-[250px] overflow-auto px-1 py-2">
                <Timeline
                    items={updates.map((item) => ({
                        dot: (
                            <div
                                className={`h-4 w-4 rounded-full border-2 border-white shadow-sm ${
                                    item.isNew ? 'bg-blue-800' : 'bg-gray-300'
                                }`}
                            />
                        ),
                        children: (
                            <div className="pb-6">
                                <div className="mb-1 text-[10px] font-bold text-gray-300">
                                    {item.time}
                                </div>
                                <h4 className="mb-1 text-sm font-bold text-gray-900">
                                    {item.title}
                                </h4>
                                <p className="m-0 text-xs leading-relaxed text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                        ),
                    }))}
                />
            </div>
        </Card>
    );
}
