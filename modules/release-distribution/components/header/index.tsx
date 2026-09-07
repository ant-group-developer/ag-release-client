import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import {
    BarsOutlined,
    CalendarOutlined,
    ExportOutlined,
    FileTextOutlined,
    ImportOutlined,
    SearchOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { RELEASE_CI_DATA_STATUS } from '../../enums';
import { ReleaseCiDataFilter } from '../../types';

const normalizeBooleanFilterValue = (value: unknown) => {
    if (value === true || value === 'true') return 'true';
    if (value === false || value === 'false') return 'false';
    return undefined;
};

type Props = {
    dataFilter: ReleaseCiDataFilter;
    defaultFilter?: ReleaseCiDataFilter;
    onChangeFilter: OnChangeFilter<ReleaseCiDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function ReleaseDistributionHeader({
    dataFilter,
    defaultFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const messages = useTranslations();

    const releaseTypeOptions = useMemo(
        () => [
            {
                label: messages('common.audio'),
                value: RELEASE_TYPE.AUDIO,
            },
            {
                label: messages('common.video'),
                value: RELEASE_TYPE.VIDEO,
            },
        ],
        [messages]
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
        return [
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
                key: 'type',
                label: messages('common.type'),
                icon: <FileTextOutlined />,
                type: 'radio',
                filterKey: 'type',
                options: releaseTypeOptions,
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
                key: 'status',
                label: messages('common.status'),
                icon: <BarsOutlined />,
                type: 'checkbox',
                filterKey: 'status',
                options: releaseCiStatusOptions,
                isCommaSeparated: true,
            },
            {
                key: 'neverExported',
                label: messages('releaseCiData.neverExported'),
                icon: <ExportOutlined />,
                type: 'radio',
                filterKey: 'neverExported',
                options: booleanFilterOptions,
            },
            {
                key: 'lastImportIsFailed',
                label: messages('releaseCiData.lastImportIsFailed'),
                icon: <WarningOutlined />,
                type: 'radio',
                filterKey: 'lastImportIsFailed',
                options: booleanFilterOptions,
            },
            {
                key: 'isSkipImport',
                label: 'Skip import CI',
                icon: <ImportOutlined />,
                type: 'radio',
                filterKey: 'isSkipImport',
                options: booleanFilterOptions,
            },
            {
                key: 'hasQaFlag',
                label: 'Có QA flag CI',
                icon: <WarningOutlined />,
                type: 'radio',
                filterKey: 'hasQaFlag',
                options: booleanFilterOptions,
            },
            {
                key: 'needImportAgain',
                label: 'Need import again',
                icon: <ImportOutlined />,
                type: 'radio',
                filterKey: 'needImportAgain',
                options: booleanFilterOptions,
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
            },
        ];
    }, [
        messages,
        releaseTypeOptions,
        isImportedFromReportOptions,
        releaseCiStatusOptions,
        booleanFilterOptions,
    ]);

    const handleChangeFilter = (
        newValue: Partial<ReleaseCiDataFilter>,
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
        copy.neverExported = normalizeBooleanFilterValue(copy.neverExported);
        copy.lastImportIsFailed = normalizeBooleanFilterValue(
            copy.lastImportIsFailed
        );
        copy.isSkipImport = normalizeBooleanFilterValue(copy.isSkipImport);
        copy.hasQaFlag = normalizeBooleanFilterValue(copy.hasQaFlag);
        copy.needImportAgain = normalizeBooleanFilterValue(
            copy.needImportAgain
        );
        return copy;
    }, [dataFilter]);

    return (
        <div className="app-header">
            <div className="flex flex-wrap items-center gap-2">
                <AppSearch
                    key={dataFilter?.keyword ?? ''}
                    defaultValue={dataFilter?.keyword}
                    wrapperClassName="w-40 sm:w-52"
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
            </div>
        </div>
    );
}
