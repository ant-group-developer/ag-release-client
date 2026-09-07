import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import AppSearch from '@/components/ui/input/search';
import { SIZE_ICON } from '@/constants/common';
import { UseFilterProps } from '@/hooks/use-filter';
import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetListSimpleChannel } from '@/modules/channels/hooks/use-get-list-simple-channel';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { useGetListSimpleTenant } from '@/modules/tenant/hooks/use-get-simple-list';
import {
    BarcodeOutlined,
    BarsOutlined,
    ImportOutlined,
    SoundOutlined,
    TeamOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import { Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type Props = Pick<
    UseFilterProps<ReleasesDataFilter>,
    | 'dataFilter'
    | 'defaultFilter'
    | 'onChangeFilter'
    | 'canClearFilter'
    | 'removeFilter'
    | 'onSearch'
>;

export default function ReleaseVideoHeader({
    dataFilter,
    defaultFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    onSearch,
}: Props) {
    const messages = useTranslations();
    const { isAdmin } = useAuth();

    const [artistKeyword, setArtistKeyword] = useState('');
    const { channelsData, isLoading: isLoadingChannels } =
        useGetListSimpleChannel();
    const { genresData } = useGetListSimpleGenres();
    const { tenantSimpleData, isLoading: isLoadingTenants } =
        useGetListSimpleTenant();
    const { artistsData, isLoading: isLoadingArtists } = useGetArtistSimpleList(
        {
            keyword: artistKeyword,
            pageSize: 100,
        }
    );

    const channelOptions = useMemo(
        () =>
            channelsData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [channelsData]
    );

    const releaseStatusOptions = useMemo(
        () =>
            Object.values(RELEASES_STATUS).map((item) => ({
                label: messages(`release.statusV2.${item}`),
                value: item,
            })),
        [messages]
    );

    const genreOptions = useMemo(
        () =>
            genresData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [genresData]
    );

    const artistOptions = useMemo(
        () =>
            artistsData?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [artistsData]
    );

    const tenantOptions = useMemo(
        () =>
            tenantSimpleData.map((item) => ({
                label: item.name,
                value: item.id,
            })),
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
                key: 'channelId',
                label: messages('releaseVideo.fields.channel'),
                icon: <YoutubeOutlined />,
                type: 'checkbox',
                filterKey: 'channelId',
                options: channelOptions,
                loading: isLoadingChannels,
                isCommaSeparated: true,
            },
            {
                key: 'isrc',
                label: messages('releaseVideo.fields.isrc'),
                icon: <BarcodeOutlined />,
                type: 'input',
                filterKey: 'isrc',
                placeholder: messages('placeholder.filterBy', {
                    value: messages('releaseVideo.fields.isrc').toLowerCase(),
                }),
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
                key: 'primaryGenreId',
                label: messages('genre.label'),
                icon: <SoundOutlined />,
                type: 'checkbox',
                filterKey: 'primaryGenreId',
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
                key: 'artistId',
                label: messages('artist.label'),
                icon: <TeamOutlined />,
                type: 'checkbox',
                filterKey: 'artistId',
                options: artistOptions,
                loading: isLoadingArtists,
                isCommaSeparated: true,
                onSearch: (val) => setArtistKeyword(val),
            },
        ];

        if (isAdmin) {
            configs.unshift({
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
        isAdmin,
        tenantOptions,
        isLoadingTenants,
        channelOptions,
        isLoadingChannels,
        releaseStatusOptions,
        genreOptions,
        isImportedFromReportOptions,
        artistOptions,
        isLoadingArtists,
    ]);

    const handleChangeFilter = (
        newValue: Partial<ReleasesDataFilter>,
        backToFirstPage?: boolean
    ) => {
        const nextValue = { ...newValue };
        if ('isImportedFromReport' in nextValue) {
            const val = nextValue.isImportedFromReport;
            if (!val) {
                nextValue.isImportedFromReport = 'true';
            }
        }
        onChangeFilter(nextValue, backToFirstPage);
    };

    const mappedDataFilter = useMemo(() => {
        const copy = { ...dataFilter };
        if (!copy.isImportedFromReport || copy.isImportedFromReport === 'all') {
            copy.isImportedFromReport = 'true';
        }
        return copy;
    }, [dataFilter]);

    return (
        <div className="app-header">
            <div className="flex flex-wrap items-center gap-2">
                <AppSearch
                    wrapperClassName="w-40 sm:w-52"
                    onChange={onSearch}
                    defaultValue={dataFilter.keyword}
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
