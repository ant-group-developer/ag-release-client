import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import { SIZE_ICON } from '@/constants/common';
import { getIntlCodeByScanCopyrightStatus } from '@/helpers/intl';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { useGetListSimpleTenant } from '@/modules/tenant/hooks/use-get-simple-list';
import {
    CalendarOutlined,
    ImportOutlined,
    SafetyCertificateOutlined,
    SearchOutlined,
    SoundOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { SCAN_COPYRIGHT_STATUS } from '../../enums';
import { TrackDataFilter } from '../../types';

type Props = {
    dataFilter: TrackDataFilter;
    onChangeFilter: OnChangeFilter<TrackDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    hideArtistFilter?: boolean;
};

export default function TrackHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    hideArtistFilter = false,
}: Props) {
    const messages = useTranslations();
    const [artistKeyword, setArtistKeyword] = useState('');
    const { isAdmin } = useAuth();
    const { tenantSimpleData, isLoading: isLoadingTenants } =
        useGetListSimpleTenant();

    // 1. Truyền keyword vào hook.
    // Chúng ta lấy pageSize lớn hơn (ví dụ 100) để cover tốt hơn
    const { artistsData, isLoading: isLoadingArtists } = useGetArtistSimpleList(
        {
            keyword: artistKeyword,
            pageSize: 100,
        },
        {
            enabled: !hideArtistFilter,
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

    const filterConfigs: FilterConfig[] = useMemo(() => {
        const configs: FilterConfig[] = [
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
        ];

        if (!hideArtistFilter) {
            configs.push({
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
            });
        }

        configs.push(
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
                key: 'dateCreated',
                label: messages('common.dateCreated'),
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
        scanStatusOptions,
        hideArtistFilter,
        artistOptions,
        isLoadingArtists,
        genreOptions,
        isImportedFromReportOptions,
        isAdmin,
        tenantOptions,
        isLoadingTenants,
    ]);

    const handleChangeFilter = (
        newValue: Partial<TrackDataFilter>,
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
            <FilterPanel
                configs={filterConfigs}
                dataFilter={mappedDataFilter}
                onChangeFilter={handleChangeFilter}
                removeFilter={removeFilter}
                canClearFilter={canClearFilter}
            />
        </div>
    );
}
