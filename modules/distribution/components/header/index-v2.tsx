import AppFilter from '@/components/ui/antd-form/app-filter';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import ArtistSelect from '@/components/ui/select/artist-select';
import GenresSelect from '@/components/ui/select/genres-select';
import { arrayFromString, getDateRange } from '@/helpers/array';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { DistributionDataFilter } from '../../types';

type Props = {
    dataFilter: DistributionDataFilter;
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
    canClearFilter: boolean;
    dataUpdatedAt: number | null;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function DistributionHeaderV2({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    dataUpdatedAt,
    removeFilter,
    handleRefresh,
}: Props) {
    // const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    const [form] = ProForm.useForm();
    const messages = useTranslations();
    const { releaseTypesData } = useGetListSimpleReleaseTypes();
    const releaseStatus = Object.values(RELEASES_STATUS).map((item) => ({
        label: messages(`release.statusV2.${item}`),
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
    }, [dataFilter, form]);

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
                    placeholder={messages('placeholder.searchBy', {
                        value: messages('common.keyword').toLowerCase(),
                    })}
                />
                <ProFormSelect
                    name="albumFormatId"
                    label={messages('releaseType.label')}
                    options={releaseTypesData?.map((item) => ({
                        value: item?.id,
                        label: item?.name,
                    }))}
                    mode="multiple"
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('release.type').toLowerCase(),
                    })}
                />
                <ProForm.Item name="artistId" label={messages('artist.label')}>
                    <ArtistSelect
                        showCreate={false}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('artist.artists').toLowerCase(),
                        })}
                        mode="multiple"
                    />
                </ProForm.Item>

                <ProFormSelect
                    name="status"
                    label={messages('common.status')}
                    options={releaseStatus}
                    mode="multiple"
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('common.status').toLowerCase(),
                    })}
                />

                <ProForm.Item name="genres" label={messages('genre.label')}>
                    <GenresSelect
                        allowClear
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('genre.genres').toLowerCase(),
                        })}
                        mode="multiple"
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
