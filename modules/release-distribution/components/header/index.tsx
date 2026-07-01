import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import {
    BarsOutlined,
    CalendarOutlined,
    SearchOutlined,
    ImportOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { RELEASE_CI_DATA_STATUS } from '../../enums';
import { ReleaseCiDataFilter } from '../../types';

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
    }, [messages, isImportedFromReportOptions, releaseCiStatusOptions]);

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
