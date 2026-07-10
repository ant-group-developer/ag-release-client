import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import { FilterConfig, FilterPanel } from '@/components/filter-panel';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { APP_ROUTES } from '@/enums/routes';
import { UseFilterProps } from '@/hooks/use-filter';
import { useRouter } from '@/i18n/routing';
import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetListSimpleChannel } from '@/modules/channels/hooks/use-get-list-simple-channel';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { RELEASES_STATUS, RELEASE_TYPE } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { ReleasesDataFilter } from '@/modules/releases/types';
import {
    BarcodeOutlined,
    BarsOutlined,
    ImportOutlined,
    SoundOutlined,
    TeamOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
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
    const router = useRouter();
    const { createReleaseDraft, isPending } = useCreateReleaseDraft();
    const { isSystemTenant } = useAuth();

    const [artistKeyword, setArtistKeyword] = useState('');
    const { channelsData, isLoading: isLoadingChannels } =
        useGetListSimpleChannel();
    const { genresData } = useGetListSimpleGenres();
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
        return [
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
    }, [
        messages,
        channelOptions,
        isLoadingChannels,
        releaseStatusOptions,
        genreOptions,
        isImportedFromReportOptions,
        artistOptions,
        isLoadingArtists,
    ]);

    const handleCreateReleaseVideo = () => {
        nProgress.start();
        createReleaseDraft({
            payload: {
                title: 'New release video',
                type: RELEASE_TYPE.VIDEO,
            },
            onSuccess: (data) => {
                nProgress.done();
                if (data?.id) {
                    router.push(`${APP_ROUTES.RELEASE_VIDEOS}/${data.id}`);
                } else {
                    router.push(APP_ROUTES.RELEASE_VIDEOS);
                }
            },
            onError: () => {
                nProgress.done();
            },
        });
    };

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
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <Space>
                    <AppSearch
                        className="max-w-52"
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
                </Space>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    {!isSystemTenant && (
                        <PermissionGate
                            permission={PERMISSION.RELEASE_VIDEO.CREATE}
                        >
                            <CreateButton
                                canCreate={true}
                                text={messages('releaseVideo.add')}
                                loading={isPending}
                                onClick={handleCreateReleaseVideo}
                            />
                        </PermissionGate>
                    )}
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
