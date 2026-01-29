import AppFilter from '@/components/ui/antd-form/app-filter';
import ArtistSelect from '@/components/ui/select/artist-select';
import LabelSelect from '@/components/ui/select/label-select';
import ReleasesSelect from '@/components/ui/select/releases-select';
import TracksSelect from '@/components/ui/select/tracks-select';
import { arrayFromString, getDateRange } from '@/helpers/array';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetListDspSimple } from '@/modules/dsp/hooks/use-get-list-simple-dsp';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { RevenueDataFilter } from '../../types';

type Props = {
    dataFilter: RevenueDataFilter;
    onChangeFilter: OnChangeFilter<RevenueDataFilter>;
    canClearFilter: boolean;
    dataUpdatedAt: number | null;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function RevenueHeaderV2({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    dataUpdatedAt,
    removeFilter,
    handleRefresh,
}: Props) {
    const [form] = ProForm.useForm();
    const messages = useTranslations();

    const { dspData, isFetching: isDspFetching } = useGetListDspSimple();

    const initialValue = {
        ...dataFilter,
        releaseId: arrayFromString(dataFilter?.releaseId),
        artistId: arrayFromString(dataFilter?.artistId),
        trackId: arrayFromString(dataFilter?.trackId),
        labelId: arrayFromString(dataFilter?.labelId),
        dspId: arrayFromString(dataFilter?.dspId),
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

                <ProForm.Item name="artistId" label={messages('artist.label')}>
                    <ArtistSelect
                        showCreate={false}
                        allowClear
                        dropdownMatchSelectWidth={false}
                        placeholder={messages('placeholder.selectArtist')}
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProForm.Item
                    name="releaseId"
                    label={messages('release.label')}
                >
                    <ReleasesSelect
                        placeholder={messages('placeholder.selectRelease')}
                        allowClear
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProForm.Item name="trackId" label={messages('track.label')}>
                    <TracksSelect
                        placeholder={messages('placeholder.selectTrack')}
                        allowClear
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProForm.Item name="labelId" label={messages('label.label')}>
                    <LabelSelect
                        placeholder={messages('placeholder.selectLabel')}
                        allowClear
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProFormSelect
                    name={'dspId'}
                    label="DSP"
                    placeholder={messages('placeholder.selectDsp')}
                    options={dspData?.map((item) => ({
                        label: item?.name,
                        value: item?.id,
                    }))}
                />
            </AppFilter>
        </div>
    );
}
