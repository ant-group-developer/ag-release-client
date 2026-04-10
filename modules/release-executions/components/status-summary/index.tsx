import { RELEASE_EXECUTION_STATUS } from '@/modules/release-executions/enums';
import { Card, Skeleton, theme } from 'antd';
import { useTranslations } from 'next-intl';

type StatusSummaryItem = {
    status: RELEASE_EXECUTION_STATUS;
    count: number;
};

type Props = {
    items: StatusSummaryItem[];
    loading?: boolean;
};

const STATUS_STYLES: Record<
    RELEASE_EXECUTION_STATUS,
    {
        accent: string;
    }
> = {
    [RELEASE_EXECUTION_STATUS.QUEUED]: {
        accent: '#64748b',
    },
    [RELEASE_EXECUTION_STATUS.RUNNING]: {
        accent: '#2563eb',
    },
    [RELEASE_EXECUTION_STATUS.AWAITING_ACTION]: {
        accent: '#ea580c',
    },
    [RELEASE_EXECUTION_STATUS.COMPLETED]: {
        accent: '#16a34a',
    },
    [RELEASE_EXECUTION_STATUS.PARTIALLY_COMPLETED]: {
        accent: '#ca8a04',
    },
    [RELEASE_EXECUTION_STATUS.FAILED]: {
        accent: '#dc2626',
    },
    [RELEASE_EXECUTION_STATUS.CANCELLED]: {
        accent: '#475569',
    },
};

export default function ReleaseExecutionStatusSummary({
    items,
    loading,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (loading) {
        return (
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton.Button
                        key={index}
                        active
                        block
                        className="!h-[116px] !rounded-xl"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {items.map((item) => {
                const statusStyle = STATUS_STYLES[item.status];

                return (
                    <Card
                        key={item.status}
                        bordered={false}
                        className="shadow-sm"
                        styles={{
                            body: {
                                padding: 16,
                                backgroundColor: token.colorBgContainer,
                                borderRadius: 8,
                            },
                        }}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                    {messages(
                                        `releaseExecution.statusOptions.${item.status}`
                                    )}
                                </div>
                                <div
                                    className="mt-3 text-3xl font-semibold leading-none"
                                    style={{ color: statusStyle.accent }}
                                >
                                    {item.count}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
