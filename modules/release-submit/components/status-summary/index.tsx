import { RELEASE_SUBMIT_STATUS } from '@/modules/release-submit/enums';
import { Card, Skeleton, theme } from 'antd';
import { useTranslations } from 'next-intl';

type StatusSummaryItem = {
    status: RELEASE_SUBMIT_STATUS;
    count: number;
};

type Props = {
    items: StatusSummaryItem[];
    loading?: boolean;
    onStatusClick?: (status: RELEASE_SUBMIT_STATUS) => void;
};

const STATUS_STYLES: Record<
    RELEASE_SUBMIT_STATUS,
    {
        accent: string;
    }
> = {
    [RELEASE_SUBMIT_STATUS.NEW]: {
        accent: '#64748b',
    },
    [RELEASE_SUBMIT_STATUS.PROCESSING]: {
        accent: '#2563eb',
    },
    [RELEASE_SUBMIT_STATUS.WAITING_ACTION]: {
        accent: '#ea580c',
    },
    [RELEASE_SUBMIT_STATUS.WAITING_PARTNER]: {
        accent: '#7c3aed',
    },
    [RELEASE_SUBMIT_STATUS.DONE]: {
        accent: '#16a34a',
    },
    [RELEASE_SUBMIT_STATUS.FAILED]: {
        accent: '#dc2626',
    },
    [RELEASE_SUBMIT_STATUS.CANCELLED]: {
        accent: '#475569',
    },
};

const STATUS_SUMMARY_GRID_CLASS =
    'mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7';

export default function ReleaseSubmitStatusSummary({
    items,
    loading,
    onStatusClick,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const skeletonItems = Object.values(RELEASE_SUBMIT_STATUS);

    if (loading) {
        return (
            <div className={STATUS_SUMMARY_GRID_CLASS}>
                {skeletonItems.map((status) => (
                    <Skeleton.Button
                        key={status}
                        active
                        block
                        className="!h-[116px] !rounded-lg"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={STATUS_SUMMARY_GRID_CLASS}>
            {items.map((item) => {
                const statusStyle = STATUS_STYLES[item.status];

                return (
                    <Card
                        key={item.status}
                        variant="borderless"
                        hoverable={!!onStatusClick}
                        role={onStatusClick ? 'button' : undefined}
                        tabIndex={onStatusClick ? 0 : undefined}
                        className="shadow-sm"
                        onClick={() => onStatusClick?.(item.status)}
                        onKeyDown={(event) => {
                            if (
                                !onStatusClick ||
                                (event.key !== 'Enter' && event.key !== ' ')
                            ) {
                                return;
                            }

                            event.preventDefault();
                            onStatusClick(item.status);
                        }}
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
                                        `releaseExecution.submitStatusOptions.${item.status}`
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
