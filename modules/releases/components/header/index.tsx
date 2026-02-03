import AppFilter from '@/components/ui/antd-form/app-filter';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import ArtistSelect from '@/components/ui/select/artist-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LabelSelect from '@/components/ui/select/label-select';
import { arrayFromString, getDateRange } from '@/helpers/array';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { RELEASES_COLUMNS_DISPLAY, RELEASES_STATUS } from '../../enums';
import { ReleasesDataFilter } from '../../types';

type Props = {
    dataFilter: ReleasesDataFilter;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
    canClearFilter: boolean;
    dataUpdatedAt: number | null;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
    visibleColumn?: RELEASES_COLUMNS_DISPLAY[];
    handleChangeVisibleColumns?: (columns: RELEASES_COLUMNS_DISPLAY[]) => void;
};

export default function ReleasesHeaderV2({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    dataUpdatedAt,
    removeFilter,
    handleRefresh,
    visibleColumn,
    handleChangeVisibleColumns,
}: Props) {
    // const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    const [form] = ProForm.useForm();
    const messages = useTranslations();
    const { releaseTypesData } = useGetListSimpleReleaseTypes();
    const releaseStatus = Object.values(RELEASES_STATUS).map((item) => ({
        label: messages(getIntlCodeByReleaseStatus(item)),
        value: item,
    }));

    const initialValue = {
        ...dataFilter,
        albumFormatId: arrayFromString(dataFilter?.albumFormatId),
        artistId: arrayFromString(dataFilter?.artistId),
        status: arrayFromString(dataFilter?.status),
        genres: arrayFromString(dataFilter?.genres),
        dateCreated: getDateRange(
            dataFilter?.startCreatedAt,
            dataFilter?.endCreatedAt
        ),
        dateUpdated: getDateRange(
            dataFilter?.startUpdatedAt,
            dataFilter?.endUpdatedAt
        ),
    };

    const handleSubmit = (values: any) => {
        const { dateCreated, dateUpdated, ...res } = values;
        const startCreatedAt = dateCreated?.[0] ? dateCreated[0] : null;
        const endCreatedAt = dateCreated?.[1] ? dateCreated[1] : null;

        const startUpdatedAt = dateUpdated?.[0] ?? null;
        const endUpdatedAt = dateUpdated?.[1] ?? null;
        onChangeFilter({
            ...res,
            startCreatedAt,
            endCreatedAt,
            startUpdatedAt,
            endUpdatedAt,
        });
    };

    const handleReset = (values: any) => {
        removeFilter();
        form.setFieldsValue({});
    };

    useEffect(() => {
        form.setFieldsValue(initialValue);
    }, [JSON.stringify(dataFilter)]);

    return (
        <div className="app-header mb-4">
            <AppFilter
                form={form}
                onFinish={handleSubmit}
                onReset={handleReset}
            >
                <ProFormText
                    name="keyword"
                    label={messages('common.search')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('common.keyword').toLowerCase(),
                    })}
                />
                <ProFormSelect
                    name="albumFormatId"
                    label={messages('releaseType.label')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('releaseType.label').toLowerCase(),
                    })}
                    options={releaseTypesData?.map((item) => ({
                        value: item?.id,
                        label: item?.name,
                    }))}
                    mode="multiple"
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                />

                <ProForm.Item name="labelId" label={messages('label.label')}>
                    <LabelSelect
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('label.label').toLowerCase(),
                        })}
                        allowClear
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProForm.Item name="artistId" label={messages('artist.label')}>
                    <ArtistSelect
                        showCreate={false}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('artist.label').toLowerCase(),
                        })}
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProFormSelect
                    name="status"
                    label={messages('common.status')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('status.label').toLowerCase(),
                    })}
                    options={releaseStatus}
                    mode="multiple"
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                />

                <ProForm.Item name="genres" label={messages('genre.label')}>
                    <GenresSelect
                        allowClear
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('genre.label').toLowerCase(),
                        })}
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProForm.Item
                    name="dateCreated"
                    label={messages('common.dateCreated')}
                >
                    <DateRangePicker
                        className="w-full"
                        allowClear
                        placement="topLeft"
                    />
                </ProForm.Item>
                <ProForm.Item
                    name="dateUpdated"
                    label={messages('common.dateUpdated')}
                >
                    <DateRangePicker
                        allowClear
                        className="w-full"
                        placement="topLeft"
                    />
                </ProForm.Item>
            </AppFilter>
        </div>
    );
}
