import AppFilter from '@/components/ui/antd-form/app-filter';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import ArtistSelect from '@/components/ui/select/artist-select';
import GenresSelect from '@/components/ui/select/genres-select';
import { arrayFromString, getDateRange } from '@/helpers/array';
import { getIntlCodeByScanCopyrightStatus } from '@/helpers/intl';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { SCAN_COPYRIGHT_STATUS } from '../../enums';
import { TrackDataFilter } from '../../types';

type Props = {
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    canClearFilter: boolean;
    dataUpdatedAt: number | null;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function TrackHeaderV2({
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

    const initialValue = {
        ...dataFilter,
        artistId: arrayFromString(dataFilter?.artistId),
        genres: arrayFromString(dataFilter?.genres),
        scanCopyrightStatus: arrayFromString(dataFilter?.scanCopyrightStatus),
        dateCreated: getDateRange(
            dataFilter?.startCreatedAt,
            dataFilter?.endCreatedAt
        ),
    };

    const handleSubmit = (values: any) => {
        const { dateCreated, dateUpdated, ...res } = values;
        const startCreatedAt = dateCreated?.[0] ?? null;
        const endCreatedAt = dateCreated?.[1] ?? null;

        onChangeFilter({
            ...res,
            startCreatedAt,
            endCreatedAt,
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
                    placeholder={messages('placeholder.searchBy')}
                />

                <ProFormSelect
                    name="scanCopyrightStatus"
                    label={messages('common.scan')}
                    options={Object.values(SCAN_COPYRIGHT_STATUS).map(
                        (item) => ({
                            label: messages(
                                getIntlCodeByScanCopyrightStatus(item) as any
                            ),
                            value: item,
                        })
                    )}
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
            </AppFilter>
        </div>
    );
}
