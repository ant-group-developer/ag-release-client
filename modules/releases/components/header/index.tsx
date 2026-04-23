import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { useGetListLabelsSimple } from '@/modules/labels/hooks/use-get-list-simple-labels';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import {
    AppstoreOutlined,
    BarsOutlined,
    CalendarOutlined,
    SearchOutlined,
    SoundOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { RELEASES_STATUS } from '../../enums';
import { ReleasesDataFilter } from '../../types';

type Props = {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function ReleasesHeaderV2({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const messages = useTranslations();
    const { releaseTypesData } = useGetListSimpleReleaseTypes();
    const { genresData } = useGetListSimpleGenres();
    const { labelsData } = useGetListLabelsSimple();

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

    const filterConfigs: FilterConfig[] = useMemo(
        () => [
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
            {
                key: 'labelId',
                label: messages('label.label'),
                icon: <TagOutlined />,
                type: 'checkbox',
                filterKey: 'labelId',
                options: labelOptions,
                isCommaSeparated: true,
            },
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
        ],
        [
            messages,
            releaseTypeOptions,
            labelOptions,
            releaseStatusOptions,
            genreOptions,
        ]
    );

    return (
        <div className="app-header mb-4">
            <FilterPanel
                configs={filterConfigs}
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
                removeFilter={removeFilter}
                canClearFilter={canClearFilter}
            />
        </div>
    );
}

// ============================================================
// OLD IMPLEMENTATION
// ============================================================
// import AppFilter from '@/components/ui/antd-form/app-filter';
// import DateRangePicker from '@/components/ui/input/date-range-picker';
// import GenresSelect from '@/components/ui/select/genres-select';
// import LabelSelect from '@/components/ui/select/label-select';
// import { arrayFromString, getDateRange } from '@/helpers/array';
// import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
// import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
// import {
//     ProForm,
//     ProFormSelect,
//     ProFormText,
// } from '@ant-design/pro-components';
// import { useTranslations } from 'next-intl';
// import { useEffect } from 'react';
// import { RELEASES_STATUS } from '../../enums';
// import { ReleasesDataFilter } from '../../types';
//
// type Props = {
//     dataFilter: ReleasesDataFilter;
//     onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
//     canClearFilter: boolean;
//     dataUpdatedAt: number | null;
//     removeFilter: RemoveFilter;
//     handleRefresh: () => void;
// };
//
// export default function ReleasesHeaderV2({
//     dataFilter,
//     onChangeFilter,
//     canClearFilter,
//     dataUpdatedAt,
//     removeFilter,
//     handleRefresh,
// }: Props) {
//     const [form] = ProForm.useForm();
//     const messages = useTranslations();
//     const { releaseTypesData } = useGetListSimpleReleaseTypes();
//     const releaseStatus = Object.values(RELEASES_STATUS).map((item) => ({
//         label: messages(`release.statusV2.${item}`),
//         value: item,
//     }));
//
//     const initialValue = {
//         ...dataFilter,
//         albumFormatId: arrayFromString(dataFilter?.albumFormatId),
//         artistId: arrayFromString(dataFilter?.artistId),
//         status: arrayFromString(dataFilter?.status),
//         genres: arrayFromString(dataFilter?.genres),
//         dateCreated: getDateRange(
//             dataFilter?.startCreatedAt,
//             dataFilter?.endCreatedAt
//         ),
//         dateUpdated: getDateRange(
//             dataFilter?.startUpdatedAt,
//             dataFilter?.endUpdatedAt
//         ),
//     };
//
//     const handleFilter = (values: any) => {
//         const { dateCreated, dateUpdated, ...res } = values;
//         const startCreatedAt = dateCreated?.[0] ?? null;
//         const endCreatedAt = dateCreated?.[1] ?? null;
//
//         const startUpdatedAt = dateUpdated?.[0] ?? null;
//         const endUpdatedAt = dateUpdated?.[1] ?? null;
//         onChangeFilter({
//             ...res,
//             startCreatedAt,
//             endCreatedAt,
//             startUpdatedAt,
//             endUpdatedAt,
//         });
//     };
//
//     const handleReset = (values: any) => {
//         removeFilter();
//         form.setFieldsValue({});
//     };
//
//     useEffect(() => {
//         form.setFieldsValue(initialValue);
//     }, [JSON.stringify(dataFilter)]);
//
//     return (
//         <div className="app-header mb-4">
//             <AppFilter
//                 form={form}
//                 onFinish={handleFilter}
//                 onReset={handleReset}
//                 onValuesChange={(_, allValues) => {
//                     handleFilter(allValues);
//                 }}
//             >
//                 <ProFormText
//                     name="keyword"
//                     label={messages('common.search')}
//                     placeholder={messages('placeholder.filterBy', {
//                         value: messages('common.keyword').toLowerCase(),
//                     })}
//                 />
//                 <ProFormSelect
//                     name="albumFormatId"
//                     label={messages('releaseType.label')}
//                     placeholder={messages('placeholder.filterBy', {
//                         value: messages('releaseType.label').toLowerCase(),
//                     })}
//                     options={releaseTypesData?.map((item) => ({
//                         value: item?.id,
//                         label: item?.name,
//                     }))}
//                     mode="multiple"
//                     fieldProps={{
//                         maxTagCount: 'responsive',
//                     }}
//                 />
//
//                 <ProForm.Item name="labelId" label={messages('label.label')}>
//                     <LabelSelect
//                         placeholder={messages('placeholder.filterBy', {
//                             value: messages('label.label').toLowerCase(),
//                         })}
//                         allowClear
//                         mode="multiple"
//                         maxTagCount={'responsive'}
//                     />
//                 </ProForm.Item>
//
//                 <ProFormSelect
//                     name="status"
//                     label={messages('common.status')}
//                     placeholder={messages('placeholder.filterBy', {
//                         value: messages('status.label').toLowerCase(),
//                     })}
//                     options={releaseStatus}
//                     mode="multiple"
//                     fieldProps={{
//                         maxTagCount: 'responsive',
//                     }}
//                 />
//
//                 <ProForm.Item name="genres" label={messages('genre.label')}>
//                     <GenresSelect
//                         allowClear
//                         placeholder={messages('placeholder.filterBy', {
//                             value: messages('genre.label').toLowerCase(),
//                         })}
//                         mode="multiple"
//                         maxTagCount={'responsive'}
//                     />
//                 </ProForm.Item>
//
//                 <ProForm.Item
//                     name="dateCreated"
//                     label={messages('common.dateCreated')}
//                 >
//                     <DateRangePicker
//                         className="w-full"
//                         allowClear
//                         placement="topLeft"
//                     />
//                 </ProForm.Item>
//                 <ProForm.Item
//                     name="dateUpdated"
//                     label={messages('common.dateUpdated')}
//                 >
//                     <DateRangePicker
//                         allowClear
//                         className="w-full"
//                         placement="topLeft"
//                     />
//                 </ProForm.Item>
//             </AppFilter>
//         </div>
//     );
// }
