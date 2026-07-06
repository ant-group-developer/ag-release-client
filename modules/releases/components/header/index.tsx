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
import { Space } from 'antd';
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
                key: 'genres',
                label: messages('genre.label'),
                icon: <SoundOutlined />,
                type: 'checkbox',
                filterKey: 'genres',
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
                key: 'ciDataStatus',
                label: messages('releaseCiData.status.label'),
                icon: <BarsOutlined />,
                type: 'radio',
                filterKey: 'ciDataStatus',
                options: releaseCiStatusOptions,
            },
            {
                key: 'neverExported',
                label: messages('releaseCiData.neverExported'),
                icon: <ExportOutlined />,
                type: 'checkbox',
                filterKey: 'neverExported',
                options: [
                    {
                        label: messages('releaseCiData.neverExported'),
                        value: 'true',
                    },
                ],
                isCommaSeparated: true,
            },
            {
                key: 'lastImportIsFailed',
                label: messages('releaseCiData.lastImportIsFailed'),
                icon: <WarningOutlined />,
                type: 'checkbox',
                filterKey: 'lastImportIsFailed',
                options: [
                    {
                        label: messages('releaseCiData.lastImportIsFailed'),
                        value: 'true',
                    },
                ],
                isCommaSeparated: true,
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
        if (copy.neverExported === true || copy.neverExported === 'true') {
            copy.neverExported = 'true';
        } else {
            copy.neverExported = undefined;
        }
        if (
            copy.lastImportIsFailed === true ||
            copy.lastImportIsFailed === 'true'
        ) {
            copy.lastImportIsFailed = 'true';
        } else {
            copy.lastImportIsFailed = undefined;
        }
        return copy;
    }, [dataFilter]);

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
                    removeFilter={removeFilter}
                    canClearFilter={canClearFilter}
                />
            </Space>
        </div>
    );
}
