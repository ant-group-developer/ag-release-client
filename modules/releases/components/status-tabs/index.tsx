import { ConfigProvider, Segmented, SegmentedProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { RELEASES_STATUS } from '../../enums';
import { useGetReleaseStatusCounts } from '../../hooks/use-get-release-status-counts';
import { ReleasesDataFilter, ReleaseStatusCountsFilter } from '../../types';
import StatusSegmentItem, { ReleaseStatusTab } from './status-segment-item';

type Props = {
    dataFilter?: ReleasesDataFilter;
    onChange: (status?: string) => void;
};

const RELEASE_STATUS_TABS: ReleaseStatusTab[] = [
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

    const countsPayload: ReleaseStatusCountsFilter = useMemo(() => {
        const payload: Record<string, any> = {
            ...dataFilter,
        };

        delete payload.status;
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
        const activeStatus = dataFilter?.status;
        if (!activeStatus) return 'all';
        if (RELEASE_STATUS_TABS.includes(activeStatus as ReleaseStatusTab)) {
            return activeStatus as ReleaseStatusTab;
        }
        if (activeStatus === 'issues') return RELEASES_STATUS.FAILED;
        if (activeStatus === 'done') return RELEASES_STATUS.DISTRIBUTED;
        return 'all';
    }, [dataFilter?.status]);

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
        }),
        [statusCounts, totalCount]
    );

    const getTabTitle = (status: ReleaseStatusTab) => {
        if (status === 'all') return commonMessages('all');
        return messages(`release.statusV2.${status}`);
    };

    const options: SegmentedProps['options'] = useMemo(
        () =>
            RELEASE_STATUS_TABS.map((status) => ({
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
        [counts, currentKey, messages, commonMessages]
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
            onChange(status === 'all' ? undefined : status);
        });
    };

    return (
        <ConfigProvider theme={customTheme}>
            <div
                className="my-4 inline-flex items-center rounded-lg p-0.5 shadow-sm"
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
        </ConfigProvider>
    );
}
