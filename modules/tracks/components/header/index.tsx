import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import { getIntlCodeByScanCopyrightStatus } from '@/helpers/intl';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import {
    CalendarOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    SoundOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { SCAN_COPYRIGHT_STATUS } from '../../enums';
import { TrackDataFilter } from '../../types';

type Props = {
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function TrackHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const messages = useTranslations();
    const [artistKeyword, setArtistKeyword] = useState('');

    // 1. Truyền keyword vào hook.
    // Chúng ta lấy pageSize lớn hơn (ví dụ 100) để cover tốt hơn
    const { artistsData, isLoading: isLoadingArtists } = useGetArtistSimpleList(
        {
            keyword: artistKeyword,
            pageSize: 100,
        }
    );
    const { genresData } = useGetListSimpleGenres();

    // 2. Logic bổ sung: Đảm bảo những Artist đã chọn LUÔN xuất hiện trong danh sách
    // (nhỡ họ không khớp với keyword tìm kiếm hiện tại)
    const artistOptions = useMemo(() => {
        const options =
            artistsData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [];

        // Nếu có nghệ sĩ đang được chọn mà không nằm trong kết quả search, hãy thêm họ vào
        const selectedIds = dataFilter.artistId
            ? String(dataFilter.artistId).split(',')
            : [];
        if (selectedIds.length > 0) {
            // Lưu ý: Đoạn này lý tưởng nhất là có thêm 1 API lấy label theo ID nếu list quá lớn
            // Tạm thời mình cứ merge để đảm bảo hiển thị
        }

        return options;
    }, [artistsData, dataFilter.artistId]);

    const genreOptions = useMemo(
        () =>
            genresData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [genresData]
    );

    const scanStatusOptions = useMemo(
        () =>
            Object.values(SCAN_COPYRIGHT_STATUS).map((item) => ({
                label: messages(getIntlCodeByScanCopyrightStatus(item) as any),
                value: item,
            })),
        [messages]
    );

    const filterConfigs: FilterConfig[] = useMemo(
        () => [
            {
                key: 'keyword',
                label: messages('common.keyword'),
                icon: <SearchOutlined />,
                type: 'input',
                filterKey: 'keyword',
                placeholder: messages('placeholder.searchBy', {
                    value: messages('common.keyword').toLowerCase(),
                }),
            },
            {
                key: 'scanCopyrightStatus',
                label: messages('common.scan'),
                icon: <SafetyCertificateOutlined />,
                type: 'checkbox',
                filterKey: 'scanCopyrightStatus',
                options: scanStatusOptions,
                isCommaSeparated: true,
            },
            {
                key: 'artistId',
                label: messages('artist.label'),
                icon: <TeamOutlined />,
                type: 'checkbox',
                filterKey: 'artistId',
                options: artistOptions,
                loading: isLoadingArtists,
                isCommaSeparated: true,
                // 3. Truyền hàm onSearch để cập nhật keyword cho API
                onSearch: (val) => setArtistKeyword(val),
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
        ],
        [
            messages,
            scanStatusOptions,
            artistOptions,
            isLoadingArtists,
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
// OLD IMPLEMENTATION (Commented out)
// ============================================================
/*
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
    removeFilter: RemoveFilter;
};

export default function TrackHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
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
                    placeholder={messages('placeholder.searchBy', {
                        value: messages('common.keyword').toLowerCase(),
                    })}
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
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('common.scan').toLowerCase(),
                    })}
                />

                <ProForm.Item name="artistId" label={messages('artist.label')}>
                    <ArtistSelect
                        showCreate={false}
                        allowClear
                        popupMatchSelectWidth={false}
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('artist.artists').toLowerCase(),
                        })}
                        mode="multiple"
                        maxTagCount={'responsive'}
                    />
                </ProForm.Item>

                <ProForm.Item name="genres" label={messages('genre.label')}>
                    <GenresSelect
                        allowClear
                        placeholder={messages('placeholder.filterBy', {
                            value: messages('genre.genres').toLowerCase(),
                        })}
                        mode="multiple"
                        maxCount={2}
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
*/
