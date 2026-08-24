import { OnChangeFilter } from '@/hooks/use-filter';
import { Button, Checkbox, theme, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { RELEASES_STATUS } from '../../enums';
import { ReleasesDataFilter } from '../../types';
import ReleaseStatusTag from '../tag/release-status-tag';

interface Props {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    onClose?: () => void;
}

export default function StatusFilterDropdown({
    dataFilter,
    onChangeFilter,
    onClose,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const initialStatuses = useMemo(() => {
        if (!dataFilter.status) return [];
        return dataFilter.status.split(',') as RELEASES_STATUS[];
    }, [dataFilter.status]);

    const [selectedStatuses, setSelectedStatuses] =
        useState<RELEASES_STATUS[]>(initialStatuses);

    useEffect(() => {
        setSelectedStatuses(initialStatuses);
    }, [initialStatuses]);

    const statusOptions = useMemo(
        () =>
            Object.values(RELEASES_STATUS).map((status) => ({
                value: status,
                label: messages(`release.statusV2.${status}`),
            })),
        [messages]
    );

    const isAllSelected =
        statusOptions.length > 0 &&
        selectedStatuses.length === statusOptions.length;
    const isSomeSelected =
        selectedStatuses.length > 0 &&
        selectedStatuses.length < statusOptions.length;

    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedStatuses(statusOptions.map((opt) => opt.value));
        } else {
            setSelectedStatuses([]);
        }
    };

    const handleToggleStatus = (status: RELEASES_STATUS, checked: boolean) => {
        if (checked) {
            setSelectedStatuses((prev) => [...prev, status]);
        } else {
            setSelectedStatuses((prev) =>
                prev.filter((item) => item !== status)
            );
        }
    };

    const handleApply = () => {
        onChangeFilter({
            status: selectedStatuses.length
                ? (selectedStatuses.join(',') as RELEASES_STATUS)
                : undefined,
        });
        onClose?.();
    };

    const handleReset = () => {
        setSelectedStatuses([]);
        onChangeFilter({
            status: undefined,
        });
        onClose?.();
    };

    return (
        <div
            className="w-64 space-y-3 p-3"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="flex items-center justify-between border-b pb-2"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <Typography.Text strong>
                    {messages('common.status')}
                </Typography.Text>
                <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={(e) => handleToggleAll(e.target.checked)}
                >
                    <Typography.Text type="secondary" className="text-xs">
                        {messages('common.selectAll')}
                    </Typography.Text>
                </Checkbox>
            </div>

            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {statusOptions.map((option) => {
                    const isChecked = selectedStatuses.includes(option.value);
                    return (
                        <div
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 hover:bg-black/5 dark:hover:bg-white/5"
                            onClick={() =>
                                handleToggleStatus(option.value, !isChecked)
                            }
                        >
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) =>
                                    handleToggleStatus(
                                        option.value,
                                        e.target.checked
                                    )
                                }
                                onClick={(e) => e.stopPropagation()}
                            />
                            <ReleaseStatusTag status={option.value} />
                        </div>
                    );
                })}
            </div>

            <div
                className="flex items-center justify-end gap-2 border-t pt-2"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <Button size="small" shape="round" onClick={handleReset}>
                    {messages('common.clearFilter')}
                </Button>
                <Button
                    type="primary"
                    size="small"
                    shape="round"
                    onClick={handleApply}
                >
                    {messages('common.apply')}
                </Button>
            </div>
        </div>
    );
}
