import ImageFallback from '@/components/ui/image/image-fallback';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { OnChangeFilter } from '@/hooks/use-filter';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { DSP_DEAL } from '@/modules/dsp/enums';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { Button, Checkbox, Select, Table, theme, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import {
    QueryReleaseDspDelivery,
    QueryReleaseDspDeliveryItem,
    ReleasesDataFilter,
} from '../../types';

type DspDeliveryFilterTableRow = {
    code: string;
    name: string;
    isActive?: boolean;
    picture?: string | null;
    enabled: boolean;
    includeStatuses: RELEASE_DSP_DELIVERY_STATUS[];
    excludeStatuses: RELEASE_DSP_DELIVERY_STATUS[];
};

type DspDeliveryQuickFilter = 'direct' | 'ci' | 'state51';

const createDspDeliveryFilterRows = (
    dsps: DspData[] = [],
    dspDelivery?: QueryReleaseDspDelivery
) => {
    const rowMap = new Map<string, DspDeliveryFilterTableRow>();

    dsps.forEach((dsp) => {
        if (!dsp.code) return;
        rowMap.set(dsp.code, {
            code: dsp.code,
            name: dsp.name,
            isActive: dsp.isActive,
            picture: dsp.picture,
            enabled: false,
            includeStatuses: [],
            excludeStatuses: [],
        });
    });

    const applyFilter = (
        item: QueryReleaseDspDeliveryItem,
        field: 'includeStatuses' | 'excludeStatuses'
    ) => {
        if (!item.code || !item.status) return;

        const dsp = dsps.find((d) => d.code === item.code);
        const row =
            rowMap.get(item.code) ??
            ({
                code: item.code,
                name: dsp?.name ?? item.code,
                isActive: dsp?.isActive ?? true,
                picture: dsp?.picture,
                enabled: false,
                includeStatuses: [],
                excludeStatuses: [],
            } satisfies DspDeliveryFilterTableRow);

        row.enabled = true;
        row[field].push(item.status);
        rowMap.set(item.code, row);
    };

    dspDelivery?.include?.forEach((item) =>
        applyFilter(item, 'includeStatuses')
    );
    dspDelivery?.exclude?.forEach((item) =>
        applyFilter(item, 'excludeStatuses')
    );

    return Array.from(rowMap.values());
};

interface Props {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    onClose?: () => void;
}

export default function DspDeliveryFilterDropdown({
    dataFilter,
    onChangeFilter,
    onClose,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const [dspDeliveryFilterRows, setDspDeliveryFilterRows] = useState<
        DspDeliveryFilterTableRow[]
    >(() => createDspDeliveryFilterRows([], dataFilter.dspDelivery));
    const [showAppliedDspOnly, setShowAppliedDspOnly] = useState(false);
    const [selectedDspDeliveryGroups, setSelectedDspDeliveryGroups] = useState<
        DspDeliveryQuickFilter[]
    >([]);

    useEffect(() => {
        setDspDeliveryFilterRows(
            createDspDeliveryFilterRows(
                dspData?.items ?? [],
                dataFilter.dspDelivery
            )
        );
    }, [dspData?.items, dataFilter.dspDelivery]);

    const dspDeliveryStatusOptions = useMemo(
        () =>
            Object.values(RELEASE_DSP_DELIVERY_STATUS).map((status) => ({
                label: messages(`releaseDsp.status.${status}`),
                value: status,
            })),
        [messages]
    );

    const dspDeliveryQuickFilterOptions = useMemo(
        () => [
            {
                label: messages('releaseDsp.dspDirect'),
                value: 'direct',
            },
            {
                label: messages('releaseDsp.dspCi'),
                value: 'ci',
            },
            {
                label: messages('releaseDsp.dspState51'),
                value: 'state51',
            },
        ],
        [messages]
    );

    const changeDspDeliveryFilter = (
        dspDelivery: QueryReleaseDspDelivery | undefined
    ) => {
        onChangeFilter({ dspDelivery });
    };

    const parseDspDeliveryFilterRows = (rows: DspDeliveryFilterTableRow[]) => {
        const include: QueryReleaseDspDeliveryItem[] = [];
        const exclude: QueryReleaseDspDeliveryItem[] = [];

        rows.forEach((row) => {
            if (!row.enabled) return;

            row.includeStatuses.forEach((status) => {
                include.push({ code: row.code, status });
            });
            row.excludeStatuses.forEach((status) => {
                exclude.push({ code: row.code, status });
            });
        });

        if (!include.length && !exclude.length) return undefined;

        return {
            ...(include.length ? { include } : {}),
            ...(exclude.length ? { exclude } : {}),
        };
    };

    const updateDspDeliveryFilterRow = (
        code: string,
        value: Partial<Omit<DspDeliveryFilterTableRow, 'code' | 'name'>>
    ) => {
        if (value.enabled === false) {
            setShowAppliedDspOnly(false);
        }

        const nextRows = dspDeliveryFilterRows.map((row) =>
            row.code === code ? { ...row, ...value } : row
        );

        setDspDeliveryFilterRows(nextRows);
    };

    const applyQuickDspDeliveryFilter = (codes: string[]) => {
        const codeSet = new Set(codes);
        const nextRows = dspDeliveryFilterRows.map((row) => ({
            ...row,
            enabled: codeSet.has(row.code),
        }));

        setDspDeliveryFilterRows(nextRows);
        setShowAppliedDspOnly(true);
    };

    const getDspDeliveryCodesByGroups = (groups: DspDeliveryQuickFilter[]) => {
        const groupSet = new Set(groups);
        const codeSet = new Set<string>();

        (dspData?.items ?? []).forEach((dsp) => {
            if (!dsp.code) return;

            const isDirect = dsp.dspRoutingConfig?.mode === DSP_DEAL.DIRECT;
            const isCi = !isDirect && dsp.hasDeal;
            const isState51 = !isDirect && !dsp.hasDeal;

            if (
                (groupSet.has('direct') && isDirect) ||
                (groupSet.has('ci') && isCi) ||
                (groupSet.has('state51') && isState51)
            ) {
                codeSet.add(dsp.code);
            }
        });

        return codeSet;
    };

    const applyDspDeliveryGroupFilter = (groups: DspDeliveryQuickFilter[]) => {
        setSelectedDspDeliveryGroups(groups);

        if (!groups.length) {
            toggleAllDspDeliveryFilter(false);
            return;
        }

        applyQuickDspDeliveryFilter(
            Array.from(getDspDeliveryCodesByGroups(groups))
        );
    };

    const toggleAllDspDeliveryFilter = (checked: boolean) => {
        const visibleCodeSet = new Set(
            dspDeliveryFilterDataSource.map((row) => row.code)
        );
        const nextRows = dspDeliveryFilterRows.map((row) =>
            visibleCodeSet.has(row.code) ? { ...row, enabled: checked } : row
        );

        setDspDeliveryFilterRows(nextRows);
        setShowAppliedDspOnly(checked);
    };

    const excludeInactiveDspDeliveryFilter = () => {
        const nextRows = dspDeliveryFilterRows.map((row) =>
            row.isActive === false ? { ...row, enabled: false } : row
        );

        setDspDeliveryFilterRows(nextRows);
    };

    const updateAppliedDspDeliveryStatuses = (
        field: 'includeStatuses' | 'excludeStatuses',
        statuses: RELEASE_DSP_DELIVERY_STATUS[]
    ) => {
        const nextRows = dspDeliveryFilterRows.map((row) =>
            row.enabled ? { ...row, [field]: statuses } : row
        );

        setDspDeliveryFilterRows(nextRows);
    };

    const handleApplyDspDeliveryFilter = () => {
        changeDspDeliveryFilter(
            parseDspDeliveryFilterRows(dspDeliveryFilterRows)
        );
        onClose?.();
    };

    const handleClearDspDeliveryFilter = () => {
        setDspDeliveryFilterRows(
            createDspDeliveryFilterRows(dspData?.items ?? [])
        );
        setShowAppliedDspOnly(false);
        setSelectedDspDeliveryGroups([]);
        changeDspDeliveryFilter(undefined);
        onClose?.();
    };

    const dspDeliveryFilterDataSource = useMemo(() => {
        let dataSource = dspDeliveryFilterRows;

        if (selectedDspDeliveryGroups.length) {
            const codeSet = getDspDeliveryCodesByGroups(
                selectedDspDeliveryGroups
            );
            dataSource = dataSource.filter((row) => codeSet.has(row.code));
        }

        return showAppliedDspOnly
            ? dataSource.filter((row) => row.enabled)
            : dataSource;
    }, [dspDeliveryFilterRows, selectedDspDeliveryGroups, showAppliedDspOnly]);

    const hasVisibleDspDeliveryFilterRows =
        dspDeliveryFilterDataSource.length > 0;
    const isAllVisibleDspDeliverySelected =
        hasVisibleDspDeliveryFilterRows &&
        dspDeliveryFilterDataSource.every((row) => row.enabled);
    const isSomeVisibleDspDeliverySelected = dspDeliveryFilterDataSource.some(
        (row) => row.enabled
    );

    const dspDeliveryFilterColumns: ColumnsType<DspDeliveryFilterTableRow> = [
        {
            title: (
                <div className="flex flex-col items-center gap-1">
                    <Checkbox
                        checked={isAllVisibleDspDeliverySelected}
                        disabled={!hasVisibleDspDeliveryFilterRows}
                        indeterminate={
                            isSomeVisibleDspDeliverySelected &&
                            !isAllVisibleDspDeliverySelected
                        }
                        onChange={(event) =>
                            toggleAllDspDeliveryFilter(event.target.checked)
                        }
                    />
                </div>
            ),
            dataIndex: 'enabled',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    checked={record.enabled}
                    onChange={(event) =>
                        updateDspDeliveryFilterRow(record.code, {
                            enabled: event.target.checked,
                        })
                    }
                />
            ),
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span>{messages('dsp.label')}</span>
                    <Select
                        mode="multiple"
                        allowClear
                        options={dspDeliveryQuickFilterOptions}
                        value={selectedDspDeliveryGroups}
                        placeholder={messages('common.quickSelect')}
                        onChange={applyDspDeliveryGroupFilter}
                        className="w-full"
                        maxTagCount="responsive"
                    />
                </div>
            ),
            dataIndex: 'name',
            width: 260,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        fallbackSrc={FALLBACK_IMAGE}
                        src={record?.picture ?? FALLBACK_IMAGE}
                        alt={record?.name}
                        width={28}
                        height={28}
                        className="aspect-square flex-shrink-0 rounded object-cover"
                    />
                    <div className="flex min-w-0 flex-col">
                        <div className="flex items-center gap-2">
                            <span className="truncate font-medium">
                                {record.name}
                            </span>
                            {record.isActive === false && (
                                <CustomTooltip
                                    title={messages('distribution.inactiveDsp')}
                                >
                                    <Lock
                                        size={14}
                                        style={{
                                            color: token.colorTextDescription,
                                        }}
                                        className="flex-shrink-0"
                                    />
                                </CustomTooltip>
                            )}
                        </div>
                        <span
                            style={{ color: token.colorTextDescription }}
                            className="truncate text-xs"
                        >
                            {record.code}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span>{messages('common.include')}</span>
                    <Select
                        mode="multiple"
                        allowClear
                        options={dspDeliveryStatusOptions}
                        placeholder={messages('common.quickSelect')}
                        onChange={(value) =>
                            updateAppliedDspDeliveryStatuses(
                                'includeStatuses',
                                value
                            )
                        }
                        className="w-full"
                        maxTagCount="responsive"
                    />
                </div>
            ),
            dataIndex: 'includeStatuses',
            width: 180,
            render: (_, record) => (
                <Select
                    mode="multiple"
                    allowClear
                    options={dspDeliveryStatusOptions}
                    value={record.includeStatuses}
                    disabled={!record.enabled}
                    onChange={(value) =>
                        updateDspDeliveryFilterRow(record.code, {
                            includeStatuses: value,
                        })
                    }
                    className="w-full"
                    maxTagCount="responsive"
                />
            ),
        },
        {
            title: (
                <div className="flex flex-col gap-1">
                    <span>{messages('common.exclude')}</span>
                    <Select
                        mode="multiple"
                        allowClear
                        options={dspDeliveryStatusOptions}
                        placeholder={messages('common.quickSelect')}
                        onChange={(value) =>
                            updateAppliedDspDeliveryStatuses(
                                'excludeStatuses',
                                value
                            )
                        }
                        className="w-full"
                        maxTagCount="responsive"
                    />
                </div>
            ),
            dataIndex: 'excludeStatuses',
            width: 180,
            render: (_, record) => (
                <Select
                    mode="multiple"
                    allowClear
                    options={dspDeliveryStatusOptions}
                    value={record.excludeStatuses}
                    disabled={!record.enabled}
                    onChange={(value) =>
                        updateDspDeliveryFilterRow(record.code, {
                            excludeStatuses: value,
                        })
                    }
                    className="w-full"
                    maxTagCount="responsive"
                />
            ),
        },
    ];

    return (
        <div
            className="max-w-[50vw] space-y-2 overflow-hidden p-3"
            onClick={(e) => e.stopPropagation()}
        >
            <Typography.Text strong className="mb-2 block !text-base">
                {messages('releaseDsp.dspFilter')}
            </Typography.Text>
            <div className="mb-2 flex flex-wrap items-center gap-2">
                <Button
                    shape="round"
                    size="small"
                    onClick={excludeInactiveDspDeliveryFilter}
                >
                    {messages('releaseDsp.excludeLockedDsp')}
                </Button>

                <Checkbox
                    checked={showAppliedDspOnly}
                    onChange={(event) =>
                        setShowAppliedDspOnly(event.target.checked)
                    }
                >
                    {messages('releaseDsp.showAppliedDspOnly')}
                </Checkbox>
            </div>

            <Table
                rowKey="code"
                size="small"
                pagination={false}
                loading={isFetchingDsp}
                columns={dspDeliveryFilterColumns}
                dataSource={dspDeliveryFilterDataSource}
                rowClassName={(record) => (record.enabled ? '' : 'opacity-50')}
                scroll={{ y: 300 }}
            />
            <div
                className="mt-2 flex justify-end gap-2 border-t pt-2"
                style={{ borderColor: token.colorBorderSecondary }}
            >
                <Button
                    shape="round"
                    size="small"
                    onClick={handleClearDspDeliveryFilter}
                >
                    {messages('common.clearFilter')}
                </Button>
                <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={handleApplyDspDeliveryFilter}
                >
                    {messages('common.apply')}
                </Button>
            </div>
        </div>
    );
}
