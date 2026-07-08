import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { FALLBACK_IMAGE, SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { DSP_DEAL } from '@/modules/dsp/enums';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { useGetListLabelsSimple } from '@/modules/labels/hooks/use-get-list-simple-labels';
import { RELEASE_CI_DATA_STATUS } from '@/modules/release-distribution/enums';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import { useGetListSimpleTenant } from '@/modules/tenant/hooks/use-get-simple-list';
import {
    AppstoreOutlined,
    AuditOutlined,
    BarsOutlined,
    CalendarOutlined,
    ExportOutlined,
    ImportOutlined,
    SearchOutlined,
    SoundOutlined,
    TagOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import {
    Badge,
    Button,
    Checkbox,
    Popover,
    Radio,
    Select,
    Space,
    Table,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Layers, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { RELEASES_STATUS } from '../../enums';
import {
    QueryReleaseDspDelivery,
    QueryReleaseDspDeliveryItem,
    ReleasesDataFilter,
} from '../../types';

type Props = {
    dataFilter: ReleasesDataFilter;
    defaultFilter?: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    hideLabelFilter?: boolean;
};

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

const normalizeBooleanFilterValue = (value: unknown) => {
    if (value === true || value === 'true') return 'true';
    if (value === false || value === 'false') return 'false';
    return undefined;
};

const getBooleanFilterLabel = (value: unknown) => {
    const normalizedValue = normalizeBooleanFilterValue(value);
    if (normalizedValue === 'true') return 'Có';
    if (normalizedValue === 'false') return 'Không';
    return undefined;
};

export default function ReleasesHeaderV2({
    dataFilter,
    defaultFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    hideLabelFilter = false,
}: Props) {
    const messages = useTranslations();
    const { releaseTypesData } = useGetListSimpleReleaseTypes();
    const { genresData } = useGetListSimpleGenres();
    const { labelsData } = useGetListLabelsSimple({
        enabled: !hideLabelFilter,
    });
    const { isAdmin } = useAuth();
    const { tenantSimpleData, isLoading: isLoadingTenants } =
        useGetListSimpleTenant();
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
    }, [dspData?.items]);

    const releaseStatusOptions = useMemo(
        () =>
            Object.values(RELEASES_STATUS).map((item) => ({
                label: messages(`release.statusV2.${item}`),
                value: item,
            })),
        [messages]
    );

    const releaseTypeOptions = useMemo(
        () =>
            releaseTypesData?.map((item) => ({
                label: item?.name,
                value: item?.id,
            })) || [],
        [releaseTypesData]
    );

    const genreOptions = useMemo(
        () =>
            genresData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [genresData]
    );

    const labelOptions = useMemo(
        () =>
            labelsData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [labelsData]
    );

    const tenantOptions = useMemo(
        () =>
            tenantSimpleData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [tenantSimpleData]
    );

    const isImportedFromReportOptions = useMemo(
        () => [
            {
                label: messages('release.importedFromReport'),
                value: 'true',
            },
            {
                label: messages('release.createdDirectly'),
                value: 'false',
            },
        ],
        [messages]
    );

    const releaseCiStatusOptions = useMemo(
        () => [
            {
                label: messages('releaseCiData.status.existsOnCi'),
                value: RELEASE_CI_DATA_STATUS.EXISTS_ON_CI,
            },
            {
                label: messages('releaseCiData.status.notFoundOnCi'),
                value: RELEASE_CI_DATA_STATUS.NOT_FOUND_ON_CI,
            },
        ],
        [messages]
    );

    const dspDeliveryStatusOptions = useMemo(
        () =>
            Object.values(RELEASE_DSP_DELIVERY_STATUS).map((status) => ({
                label: messages(`releaseDsp.status.${status}`),
                value: status,
            })),
        [messages]
    );

    const booleanFilterOptions = useMemo(
        () => [
            {
                label: 'Có',
                value: 'true',
            },
            {
                label: 'Không',
                value: 'false',
            },
        ],
        []
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

    const filterConfigs: FilterConfig[] = useMemo(() => {
        const configs: FilterConfig[] = [
            {
                key: 'keyword',
                label: messages('common.keyword'),
                icon: <SearchOutlined />,
                type: 'input',
                filterKey: 'keyword',
                placeholder: messages('placeholder.filterBy', {
                    value: messages('common.keyword').toLowerCase(),
                }),
            },
            {
                key: 'albumFormatId',
                label: messages('releaseType.label'),
                icon: <AppstoreOutlined />,
                type: 'checkbox',
                filterKey: 'albumFormatId',
                options: releaseTypeOptions,
                isCommaSeparated: true,
            },
        ];

        if (!hideLabelFilter) {
            configs.push({
                key: 'labelId',
                label: messages('label.label'),
                icon: <TagOutlined />,
                type: 'checkbox',
                filterKey: 'labelId',
                options: labelOptions,
                isCommaSeparated: true,
            });
        }

        configs.push(
            {
                key: 'status',
                label: messages('common.status'),
                icon: <BarsOutlined />,
                type: 'checkbox',
                filterKey: 'status',
                options: releaseStatusOptions,
                isCommaSeparated: true,
            },
            {
                key: 'primaryGenreId',
                label: messages('genre.label'),
                icon: <SoundOutlined />,
                type: 'checkbox',
                filterKey: 'primaryGenreId',
                options: genreOptions,
                isCommaSeparated: true,
            },
            {
                key: 'isImportedFromReport',
                label: messages('release.creationSource'),
                icon: <ImportOutlined />,
                type: 'radio',
                filterKey: 'isImportedFromReport',
                options: isImportedFromReportOptions,
            },
            {
                key: 'needsReview',
                label: messages('common.releaseReview'),
                icon: <AuditOutlined />,
                type: 'checkbox',
                filterKey: 'needsReview',
                options: [
                    {
                        label: messages('common.needsReview'),
                        value: 'true',
                    },
                ],
                isCommaSeparated: true,
            },
            {
                key: 'hasError',
                label: messages('common.releaseError'),
                icon: <WarningOutlined />,
                type: 'checkbox',
                filterKey: 'hasError',
                options: [
                    {
                        label: messages('common.hasError'),
                        value: 'true',
                    },
                ],
                isCommaSeparated: true,
            },
            {
                key: 'dataCi',
                label: 'Data CI',
                icon: <ExportOutlined />,
                type: 'custom',
                filterKey: 'dataCi',
                customFilterKeys: [
                    'ciDataStatus',
                    'neverExported',
                    'lastImportIsFailed',
                    'isSkipImport',
                    'hasQaFlag',
                ],
                render: ({ dataFilter, onChangeFilter }) => (
                    <div className="space-y-4 py-2">
                        <div>
                            <div className="mb-2 text-xs font-semibold text-gray-500">
                                {messages('releaseCiData.status.label')}
                            </div>
                            <div className="flex items-start gap-2">
                                <Radio.Group
                                    className="flex flex-col gap-2"
                                    value={dataFilter.ciDataStatus}
                                    options={releaseCiStatusOptions}
                                    onChange={(event) =>
                                        onChangeFilter({
                                            ciDataStatus: event.target.value,
                                        })
                                    }
                                />
                                {dataFilter.ciDataStatus && (
                                    <Button
                                        size="small"
                                        type="link"
                                        onClick={() =>
                                            onChangeFilter({
                                                ciDataStatus: undefined,
                                            })
                                        }
                                    >
                                        {messages('common.delete')}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                {
                                    key: 'neverExported',
                                    label: messages(
                                        'releaseCiData.neverExported'
                                    ),
                                },
                                {
                                    key: 'lastImportIsFailed',
                                    label: messages(
                                        'releaseCiData.lastImportIsFailed'
                                    ),
                                },
                                {
                                    key: 'isSkipImport',
                                    label: 'Skip import CI',
                                },
                                {
                                    key: 'hasQaFlag',
                                    label: 'Có QA flag CI',
                                },
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className="flex flex-col gap-1"
                                >
                                    <span className="text-xs font-semibold text-gray-500">
                                        {item.label}
                                    </span>
                                    <Radio.Group
                                        value={normalizeBooleanFilterValue(
                                            dataFilter[item.key]
                                        )}
                                        options={booleanFilterOptions}
                                        onChange={(event) =>
                                            onChangeFilter({
                                                [item.key]: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ),
                getDisplayValue: (dataFilter) => {
                    const values: string[] = [];
                    const ciDataStatus = dataFilter.ciDataStatus;
                    if (ciDataStatus) {
                        values.push(
                            releaseCiStatusOptions.find(
                                (option) => option.value === ciDataStatus
                            )?.label ?? String(ciDataStatus)
                        );
                    }
                    [
                        {
                            key: 'neverExported',
                            label: messages('releaseCiData.neverExported'),
                        },
                        {
                            key: 'lastImportIsFailed',
                            label: messages('releaseCiData.lastImportIsFailed'),
                        },
                        {
                            key: 'isSkipImport',
                            label: 'Skip import CI',
                        },
                        {
                            key: 'hasQaFlag',
                            label: 'Có QA flag CI',
                        },
                    ].forEach((item) => {
                        const booleanLabel = getBooleanFilterLabel(
                            dataFilter[item.key]
                        );
                        if (booleanLabel) {
                            values.push(`${item.label}: ${booleanLabel}`);
                        }
                    });
                    return values.join(' | ');
                },
            },
            {
                key: 'dateCreated',
                label: messages('common.dateCreated'),
                icon: <CalendarOutlined />,
                type: 'dateRange',
                filterKey: ['startCreatedAt', 'endCreatedAt'],
            },
            {
                key: 'dateUpdated',
                label: messages('common.dateUpdated'),
                icon: <CalendarOutlined />,
                type: 'dateRange',
                filterKey: ['startCreatedAt', 'endCreatedAt'],
            }
        );

        if (isAdmin) {
            configs.splice(1, 0, {
                key: 'tenantIds',
                label: messages('tenant.label'),
                icon: <Layers size={SIZE_ICON} />,
                type: 'checkbox',
                filterKey: 'tenantIds',
                options: tenantOptions,
                loading: isLoadingTenants,
                isCommaSeparated: true,
            });
        }

        return configs;
    }, [
        messages,
        releaseTypeOptions,
        hideLabelFilter,
        labelOptions,
        releaseStatusOptions,
        genreOptions,
        isAdmin,
        tenantOptions,
        isLoadingTenants,
        isImportedFromReportOptions,
        releaseCiStatusOptions,
        booleanFilterOptions,
    ]);

    const handleChangeFilter = (
        newValue: Partial<ReleasesDataFilter>,
        backToFirstPage?: boolean
    ) => {
        const nextValue = { ...newValue };
        if ('isImportedFromReport' in nextValue) {
            const val = nextValue.isImportedFromReport;
            if (!val) {
                nextValue.isImportedFromReport = 'all';
            }
        }
        onChangeFilter(nextValue, backToFirstPage);
    };

    const mappedDataFilter = useMemo(() => {
        const copy = { ...dataFilter };
        if (copy.isImportedFromReport === 'all') {
            copy.isImportedFromReport = undefined;
        }
        if (copy.needsReview === true || copy.needsReview === 'true') {
            copy.needsReview = 'true';
        } else {
            copy.needsReview = undefined;
        }
        if (copy.hasError === true || copy.hasError === 'true') {
            copy.hasError = 'true';
        } else {
            copy.hasError = undefined;
        }
        copy.neverExported = normalizeBooleanFilterValue(copy.neverExported);
        copy.lastImportIsFailed = normalizeBooleanFilterValue(
            copy.lastImportIsFailed
        );
        copy.isSkipImport = normalizeBooleanFilterValue(copy.isSkipImport);
        copy.hasQaFlag = normalizeBooleanFilterValue(copy.hasQaFlag);
        return copy;
    }, [dataFilter]);

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

    const handleRemoveFilter = () => {
        setDspDeliveryFilterRows(
            createDspDeliveryFilterRows(dspData?.items ?? [])
        );
        setShowAppliedDspOnly(false);
        setSelectedDspDeliveryGroups([]);
        removeFilter();
    };

    const handleApplyDspDeliveryFilter = () => {
        changeDspDeliveryFilter(
            parseDspDeliveryFilterRows(dspDeliveryFilterRows)
        );
    };

    const handleClearDspDeliveryFilter = () => {
        setDspDeliveryFilterRows(
            createDspDeliveryFilterRows(dspData?.items ?? [])
        );
        setShowAppliedDspOnly(false);
        setSelectedDspDeliveryGroups([]);
        changeDspDeliveryFilter(undefined);
    };

    const appliedDspDeliveryFilterCount = dspDeliveryFilterRows.filter(
        (row) =>
            row.enabled &&
            (row.includeStatuses.length > 0 || row.excludeStatuses.length > 0)
    ).length;

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
        // {
        //     title: messages('common.iNo'),
        //     key: 'iNo',
        //     width: 56,
        //     align: 'center',
        //     render: (_, __, index) => index + 1,
        // },
        {
            title: (
                <div className="flex flex-col items-center gap-1">
                    {/* <span>{messages('common.apply')}</span> */}
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
                                        className="flex-shrink-0 text-gray-400"
                                    />
                                </CustomTooltip>
                            )}
                        </div>
                        <span className="truncate text-xs text-gray-500">
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

    const dspDeliveryFilterContent = (
        <div className="max-w-[50vw] space-y-2 overflow-hidden">
            <Typography.Text strong className="!text-lg">
                {messages('releaseDsp.dspFilter')}
            </Typography.Text>
            <div className="mb-2 flex flex-wrap gap-2">
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
                scroll={{ x: 740, y: 320 }}
            />
            <div className="mb-2 flex justify-end gap-2 py-1">
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

    return (
        <div className="app-header">
            <Space>
                <AppSearch
                    defaultValue={dataFilter?.keyword}
                    style={{
                        width: 200,
                    }}
                    onChange={(e) =>
                        onChangeFilter({ keyword: e.target.value })
                    }
                />
                <Popover
                    trigger="click"
                    placement="bottom"
                    content={dspDeliveryFilterContent}
                    arrow={false}
                    autoAdjustOverflow
                >
                    <Badge
                        count={appliedDspDeliveryFilterCount}
                        size="small"
                        offset={[-2, 2]}
                        color="#1677ff"
                    >
                        <Button>{messages('releaseDsp.dspFilter')}</Button>
                    </Badge>
                </Popover>
                <FilterPanel
                    configs={filterConfigs}
                    dataFilter={mappedDataFilter}
                    defaultFilter={defaultFilter}
                    onChangeFilter={handleChangeFilter}
                    removeFilter={handleRemoveFilter}
                    canClearFilter={canClearFilter}
                />
            </Space>
        </div>
    );
}
