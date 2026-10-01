import { useAuth } from '@/modules/auth/hooks/use-auth';
import { ConfigProvider, Segmented, SegmentedProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { RELEASES_STATUS } from '../../enums';
import { useGetReleaseStatusCounts } from '../../hooks/use-get-release-status-counts';
import { ReleasesDataFilter, ReleaseStatusCountsFilter } from '../../types';
import StatusSegmentItem, { ReleaseStatusTab } from './status-segment-item';

type Props = {
    dataFilter?: ReleasesDataFilter;
    onChange: (
        status?: string,
        extraFilter?: { needsReview?: string | boolean }
    ) => void;
};

const BASE_RELEASE_STATUS_TABS: ReleaseStatusTab[] = [
    'all',
    RELEASES_STATUS.DRAFT,
    RELEASES_STATUS.PROCESSING,
    RELEASES_STATUS.FAILED,
    RELEASES_STATUS.PARTIAL_DONE,
];

export default function ReleaseStatusTabs({
    dataFilter,
    onChange,
}: Props) {
    const messages = useTranslations();
    const commonMessages = useTranslations('common');
    const { token } = theme.useToken();
    const { isAdmin } = useAuth();

    const statusTabs: ReleaseStatusTab[] = useMemo(() => {
        if (isAdmin) {
            const partialDoneIndex = BASE_RELEASE_STATUS_TABS.indexOf(
                RELEASES_STATUS.PARTIAL_DONE
            );
            if (partialDoneIndex !== -1) {
                const tabs = [...BASE_RELEASE_STATUS_TABS];
                tabs.splice(partialDoneIndex + 1, 0, 'needsReview');
                return tabs;
            }
            return [...BASE_RELEASE_STATUS_TABS, 'needsReview'];
        }
        return BASE_RELEASE_STATUS_TABS;
    }, [isAdmin]);

    const countsPayload: ReleaseStatusCountsFilter = useMemo(() => {
        const payload: Record<string, any> = {
            ...dataFilter,
        };

        delete payload.status;
        delete payload.needsReview;
        delete payload.page;
        delete payload.pageSize;
        delete payload.orderBy;
        delete payload.fieldOrder;

        if (payload.isImportedFromReport === 'all') {
            delete payload.isImportedFromReport;
        }

        Object.keys(payload).forEach((key) => {
            if (
                payload[key] === undefined ||
                payload[key] === null ||
                payload[key] === ''
            ) {
                delete payload[key];
            }
        });

        return payload;
    }, [dataFilter]);

    const { statusCounts } = useGetReleaseStatusCounts(countsPayload);

    const targetKey: ReleaseStatusTab = useMemo(() => {
        if (
            (dataFilter?.needsReview === true ||
                dataFilter?.needsReview === 'true') &&
            isAdmin
        ) {
            return 'needsReview';
        }
        const activeStatus = dataFilter?.status;
        if (!activeStatus) return 'all';
        if (statusTabs.includes(activeStatus as ReleaseStatusTab)) {
            return activeStatus as ReleaseStatusTab;
        }
        if (activeStatus === 'issues') return RELEASES_STATUS.FAILED;
        if (activeStatus === 'done') return RELEASES_STATUS.DISTRIBUTED;
        return 'all';
    }, [dataFilter?.status, dataFilter?.needsReview, isAdmin, statusTabs]);

    const [currentKey, setCurrentKey] = useState<ReleaseStatusTab>(targetKey);

    useEffect(() => {
        setCurrentKey(targetKey);
    }, [targetKey]);

    const totalCount = useMemo(() => {
        if (!statusCounts) return 0;
        return Object.values(statusCounts).reduce<number>(
            (acc, curr) => (typeof curr === 'number' ? acc + curr : acc),
            0
        );
    }, [statusCounts]);

    const counts: Record<string, number> = useMemo(
        () => ({
            all: totalCount,
            [RELEASES_STATUS.DRAFT]: statusCounts.draft ?? 0,
            [RELEASES_STATUS.PROCESSING]: statusCounts.processing ?? 0,
            [RELEASES_STATUS.FAILED]: statusCounts.failed ?? 0,
            [RELEASES_STATUS.PARTIAL_DONE]: statusCounts.partial_done ?? 0,
            [RELEASES_STATUS.DISTRIBUTED]: statusCounts.distributed ?? 0,
            needsReview:
                statusCounts.needsReview ??
                statusCounts.needs_review ??
                0,
        }),
        [statusCounts, totalCount]
    );

    const getTabTitle = (status: ReleaseStatusTab) => {
        if (status === 'all') return commonMessages('all');
        if (status === 'needsReview') return commonMessages('needsReview');
        return messages(`release.statusV2.${status}`);
    };

    const options: SegmentedProps['options'] = useMemo(
        () =>
            statusTabs.map((status) => ({
                value: status,
                label: (
                    <StatusSegmentItem
                        status={status}
                        title={getTabTitle(status)}
                        count={counts[status] ?? 0}
                        isSelected={currentKey === status}
                    />
                ),
            })),
        [statusTabs, counts, currentKey, messages, commonMessages]
    );

    const customTheme = useMemo(
        () => ({
            components: {
                Segmented: {
                    itemSelectedBg: token.colorFillSecondary,
                    itemSelectedColor: token.colorText,
                    trackBg: token.colorBgContainer,
                },
            },
        }),
        [token.colorFillSecondary, token.colorText, token.colorBgContainer]
    );

    const handleChange = (status: ReleaseStatusTab) => {
        setCurrentKey(status);
        startTransition(() => {
            if (status === 'needsReview') {
                onChange(undefined, { needsReview: 'true' });
            } else {
                onChange(status === 'all' ? undefined : status, {
                    needsReview: undefined,
                });
            }
        });
    };

    return (
        <ConfigProvider theme={customTheme}>
            <div className="my-4 max-w-full overflow-x-auto scrollbar-hidden">
                <div
                    className="inline-flex min-w-max items-center rounded-lg p-0.5 shadow-sm"
                    style={{
                        backgroundColor: token.colorBgContainer,
                        border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                >
                    <Segmented
                        value={currentKey}
                        options={options}
                        onChange={(status) =>
                            handleChange(status as ReleaseStatusTab)
                        }
                    />
                </div>
            </div>
        </ConfigProvider>
    );
}
