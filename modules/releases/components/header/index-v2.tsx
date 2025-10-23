import AppFilter from '@/components/ui/antd-form/app-filter';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import ArtistSelect from '@/components/ui/select/artist-select';
import GenresSelect from '@/components/ui/select/genres-select';
import { arrayFromString } from '@/helpers/array';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';
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
    visibleColumn: RELEASES_COLUMNS_DISPLAY[];
    handleChangeVisibleColumns: (columns: RELEASES_COLUMNS_DISPLAY[]) => void;
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
        dateCreated: [
            dataFilter?.startCreatedAt
                ? dayjs(dataFilter.startCreatedAt)
                : null,
            dataFilter?.endCreatedAt ? dayjs(dataFilter.endCreatedAt) : null,
        ],
        dateUpdated: [
            dataFilter?.startUpdatedAt
                ? dayjs(dataFilter.startUpdatedAt)
                : null,
            dataFilter?.endUpdatedAt ? dayjs(dataFilter.endUpdatedAt) : null,
        ],
    };

    const handleSubmit = (values: any) => {
        const { dateCreated, dateUpdated, ...res } = values;
        const startCreatedAt = dateCreated?.[0] ? dateCreated[0] : null;
        const endCreatedAt = dateCreated?.[1] ? dateCreated[1] : null;

        const startUpdatedAt = dateUpdated?.[0] ? dateUpdated[0] : null;
        const endUpdatedAt = dateUpdated?.[1] ? dateUpdated[1] : null;
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
                    name="keywords"
                    label={messages('common.search')}
                    placeholder={messages('placeholder.searchBy')}
                />
                <ProFormSelect
                    name="albumFormatId"
                    label={messages('releaseType.label')}
                    options={releaseTypesData?.map((item) => ({
                        value: item?.id,
                        label: item?.name,
                    }))}
                    mode="multiple"
                />
                <ProForm.Item name="artistId" label={messages('artist.label')}>
                    <ArtistSelect
                        showCreate={false}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        placeholder={messages('placeholder.selectArtist')}
                        mode="multiple"
                    />
                </ProForm.Item>

                <ProFormSelect
                    name="status"
                    label={messages('common.status')}
                    options={releaseStatus}
                    mode="multiple"
                />

                <ProForm.Item name="genres" label={messages('genre.label')}>
                    <GenresSelect
                        allowClear
                        placeholder={messages(
                            'release.placeholder.selectGenres'
                        )}
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
