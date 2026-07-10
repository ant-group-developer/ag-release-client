import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import AppSearch from '@/components/ui/input/search';
import { SIZE_ICON } from '@/constants/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useAuth } from '@/modules/auth/hooks/use-auth';
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
import { Button, Radio, Space } from 'antd';
import { Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { RELEASES_STATUS } from '../../enums';
import { ReleasesDataFilter } from '../../types';

type Props = {
    dataFilter: ReleasesDataFilter;
    defaultFilter?: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    hideLabelFilter?: boolean;
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
                    'needImportAgain',
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
                                    key: 'needImportAgain',
                                    label: messages('release.autoSubmitV2.needImportAgain'),
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
                            key: 'needImportAgain',
                            label: messages('release.autoSubmitV2.needImportAgain'),
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
        copy.needImportAgain = normalizeBooleanFilterValue(copy.needImportAgain);
        copy.hasQaFlag = normalizeBooleanFilterValue(copy.hasQaFlag);
        return copy;
    }, [dataFilter]);

    const handleRemoveFilter = () => {
        removeFilter();
    };

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
