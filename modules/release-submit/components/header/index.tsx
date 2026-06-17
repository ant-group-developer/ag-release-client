import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import AppSearch from '@/components/ui/input/search';
import { SIZE_ICON } from '@/constants/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { useGetListLabelsSimple } from '@/modules/labels/hooks/use-get-list-simple-labels';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { useGetListSimpleTenant } from '@/modules/tenant/hooks/use-get-simple-list';
import {
    AppstoreOutlined,
    BarsOutlined,
    CalendarOutlined,
    ImportOutlined,
    SearchOutlined,
    SoundOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Popover, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    RELEASE_EXECUTION_STEP_TYPE,
    RELEASE_SUBMIT_STATUS,
    RELEASE_SUBMIT_STEP_STATUS,
} from '../../enums';
import { formatEnumLabel } from '../../helpers';
import {
    QueryListReleasesFilter,
    ReleaseExecutionStepFilter,
    ReleaseSubmitFilter,
} from '../../types';

type Props = {
    dataFilter: ReleaseSubmitFilter;
    defaultFilter?: ReleaseSubmitFilter;
    onChangeFilter: OnChangeFilter<ReleaseSubmitFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

type StepFilterTableRow = {
    type: RELEASE_EXECUTION_STEP_TYPE;
    enabled: boolean;
    includeStatuses: RELEASE_SUBMIT_STEP_STATUS[];
    excludeStatuses: RELEASE_SUBMIT_STEP_STATUS[];
};

const createStepFilterRows = (
    stepFilters: ReleaseExecutionStepFilter[] = []
) => {
    const rowMap = new Map<RELEASE_EXECUTION_STEP_TYPE, StepFilterTableRow>(
        Object.values(RELEASE_EXECUTION_STEP_TYPE).map((type) => [
            type,
            {
                type,
                enabled: false,
                includeStatuses: [],
                excludeStatuses: [],
            },
        ])
    );

    stepFilters.forEach((step) => {
        if (!step.type) return;

        const row = rowMap.get(step.type);
        if (!row) return;

        row.enabled = true;
        if (!step.status) return;

        if (step.exclude) {
            row.excludeStatuses.push(step.status);
        } else {
            row.includeStatuses.push(step.status);
        }
    });

    return Array.from(rowMap.values());
};

export default function ReleaseSubmitHeader({
    dataFilter,
    defaultFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const messages = useTranslations();
    const { releaseTypesData } = useGetListSimpleReleaseTypes();
    const { genresData } = useGetListSimpleGenres();
    const { labelsData } = useGetListLabelsSimple();
    const { isAdmin } = useAuth();
    const { tenantSimpleData, isLoading: isLoadingTenants } =
        useGetListSimpleTenant();
    const [stepFilterRows, setStepFilterRows] = useState<StepFilterTableRow[]>(
        () => createStepFilterRows(dataFilter.steps)
    );

    const executionStatusOptions = useMemo(
        () =>
            Object.values(RELEASE_SUBMIT_STATUS).map((status) => ({
                label: formatEnumLabel(status),
                value: status,
            })),
        []
    );

    const stepStatusOptions = useMemo(
        () =>
            Object.values(RELEASE_SUBMIT_STEP_STATUS).map((status) => ({
                label: formatEnumLabel(status),
                value: status,
            })),
        []
    );

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
            },
            {
                key: 'labelId',
                label: messages('label.label'),
                icon: <TagOutlined />,
                type: 'checkbox',
                filterKey: 'labelId',
                options: labelOptions,
            },
            {
                key: 'releaseStatus',
                label: messages('common.status'),
                icon: <BarsOutlined />,
                type: 'checkbox',
                filterKey: 'status',
                options: releaseStatusOptions,
            },
            {
                key: 'genres',
                label: messages('genre.label'),
                icon: <SoundOutlined />,
                type: 'checkbox',
                filterKey: 'genres',
                options: genreOptions,
            },
            {
                key: 'isImportedFromReport',
                label: messages('release.creationSource'),
                icon: <ImportOutlined />,
                type: 'checkbox',
                filterKey: 'isImportedFromReport',
                options: isImportedFromReportOptions,
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
                filterKey: ['startUpdatedAt', 'endUpdatedAt'],
            },
        ];

        if (isAdmin) {
            configs.splice(1, 0, {
                key: 'tenantIds',
                label: messages('tenant.label'),
                icon: <Layers size={SIZE_ICON} />,
                type: 'checkbox',
                filterKey: 'tenantIds',
                options: tenantOptions,
                loading: isLoadingTenants,
            });
        }

        return configs;
    }, [
        messages,
        releaseTypeOptions,
        labelOptions,
        releaseStatusOptions,
        genreOptions,
        isAdmin,
        tenantOptions,
        isLoadingTenants,
        isImportedFromReportOptions,
    ]);

    const handleChangeFilter = (
        newValue: Partial<QueryListReleasesFilter>,
        backToFirstPage?: boolean
    ) => {
        const nextValue: Partial<QueryListReleasesFilter> = {
            ...newValue,
        };
        if ('isImportedFromReport' in nextValue) {
            const val = nextValue.isImportedFromReport;
            if (
                Array.isArray(val) &&
                val.includes('true') &&
                val.includes('false')
            ) {
                const prevVal =
                    dataFilter.queryListReleases?.isImportedFromReport;
                if (prevVal === 'true') {
                    nextValue.isImportedFromReport = 'false';
                } else if (prevVal === 'false') {
                    nextValue.isImportedFromReport = 'true';
                } else {
                    nextValue.isImportedFromReport = 'all';
                }
            } else if (Array.isArray(val)) {
                nextValue.isImportedFromReport = val[0];
            } else if (!val) {
                nextValue.isImportedFromReport = 'all';
            }
        }

        onChangeFilter(
            {
                queryListReleases: {
                    ...dataFilter.queryListReleases,
                    ...nextValue,
                },
            },
            backToFirstPage
        );
    };

    const mappedDataFilter = useMemo(() => {
        const copy = { ...dataFilter.queryListReleases };
        if (copy.isImportedFromReport === 'all') {
            copy.isImportedFromReport = undefined;
        }
        return copy;
    }, [dataFilter.queryListReleases]);

    const mappedDefaultFilter = useMemo(
        () => defaultFilter?.queryListReleases,
        [defaultFilter?.queryListReleases]
    );

    const canClearReleaseFilter = useMemo(
        () =>
            canClearFilter ||
            Object.values(mappedDataFilter).some(
                (value) =>
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    (!Array.isArray(value) || value.length > 0)
            ),
        [canClearFilter, mappedDataFilter]
    );

    const changeStepFilters = (steps: ReleaseExecutionStepFilter[]) => {
        onChangeFilter({
            steps: steps.length ? steps : undefined,
        });
    };

    const parseStepFilterRows = (rows: StepFilterTableRow[]) =>
        rows.flatMap<ReleaseExecutionStepFilter>((row) => {
            if (!row.enabled) return [];

            const includeFilters = row.includeStatuses.map((status) => ({
                type: row.type,
                status,
            }));
            const excludeFilters = row.excludeStatuses.map((status) => ({
                type: row.type,
                status,
                exclude: true,
            }));

            if (!includeFilters.length && !excludeFilters.length) {
                return [{ type: row.type }];
            }

            return [...includeFilters, ...excludeFilters];
        });

    const updateStepFilterRow = (
        type: RELEASE_EXECUTION_STEP_TYPE,
        value: Partial<Omit<StepFilterTableRow, 'type'>>
    ) => {
        const nextRows = stepFilterRows.map((row) =>
            row.type === type ? { ...row, ...value } : row
        );

        setStepFilterRows(nextRows);
        changeStepFilters(parseStepFilterRows(nextRows));
    };

    const handleRemoveFilter = () => {
        setStepFilterRows(createStepFilterRows());
        removeFilter();
    };

    const appliedStepFilterCount = stepFilterRows.filter(
        (row) => row.enabled
    ).length;

    const stepFilterColumns: ColumnsType<StepFilterTableRow> = [
        {
            title: 'Apply',
            dataIndex: 'enabled',
            width: 72,
            align: 'center',
            render: (_, record) => (
                <Checkbox
                    checked={record.enabled}
                    onChange={(event) =>
                        updateStepFilterRow(record.type, {
                            enabled: event.target.checked,
                        })
                    }
                />
            ),
        },
        {
            title: 'Step',
            dataIndex: 'type',
            width: 220,
            render: (value) => formatEnumLabel(value),
        },
        {
            title: 'Include',
            dataIndex: 'includeStatuses',
            width: 220,
            render: (_, record) => (
                <Select
                    mode="multiple"
                    allowClear
                    options={stepStatusOptions}
                    value={record.includeStatuses}
                    disabled={!record.enabled}
                    onChange={(value) =>
                        updateStepFilterRow(record.type, {
                            includeStatuses: value,
                        })
                    }
                    className="w-full"
                    maxTagCount="responsive"
                />
            ),
        },
        {
            title: 'Exclude',
            dataIndex: 'excludeStatuses',
            width: 220,
            render: (_, record) => (
                <Select
                    mode="multiple"
                    allowClear
                    options={stepStatusOptions}
                    value={record.excludeStatuses}
                    disabled={!record.enabled}
                    onChange={(value) =>
                        updateStepFilterRow(record.type, {
                            excludeStatuses: value,
                        })
                    }
                    className="w-full"
                    maxTagCount="responsive"
                />
            ),
        },
    ];

    const stepsFilterContent = (
        <div className="w-[750px]">
            <Table
                rowKey="type"
                size="small"
                pagination={false}
                columns={stepFilterColumns}
                dataSource={stepFilterRows}
                rowClassName={(record) => (record.enabled ? '' : 'opacity-50')}
                scroll={{ y: 420 }}
            />
        </div>
    );

    return (
        <Space className="font-normal">
            <AppSearch
                className="w-52"
                placeholder={messages('common.search')}
                onChange={(event) =>
                    handleChangeFilter({ keyword: event.target.value })
                }
                defaultValue={dataFilter.queryListReleases?.keyword}
                allowClear
            />

            <Select
                options={executionStatusOptions}
                placeholder={messages('placeholder.filterBy', {
                    value: messages(
                        'releaseExecution.columns.status'
                    ).toLowerCase(),
                })}
                onChange={(value) => onChangeFilter({ status: value })}
                defaultValue={dataFilter?.status}
                allowClear
                className="w-52"
            />

            <Checkbox
                checked={
                    dataFilter?.latestOnly === true ||
                    dataFilter?.latestOnly === 'true'
                }
                onChange={(event) =>
                    onChangeFilter({
                        latestOnly: event.target.checked ? true : 'all',
                    })
                }
            >
                {messages('common.latestOnly')}
            </Checkbox>

            <Popover
                trigger="click"
                placement="bottomLeft"
                content={stepsFilterContent}
                arrow={false}
            >
                <Button>
                    {messages('common.steps')}
                    {!!appliedStepFilterCount && ` (${appliedStepFilterCount})`}
                </Button>
            </Popover>

            <FilterPanel
                configs={filterConfigs}
                dataFilter={mappedDataFilter}
                defaultFilter={mappedDefaultFilter}
                onChangeFilter={handleChangeFilter}
                removeFilter={handleRemoveFilter}
                canClearFilter={canClearReleaseFilter}
            />
        </Space>
    );
}
