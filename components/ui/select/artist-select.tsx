import { cn } from '@/helpers/common';
import { useQueryParams } from '@/hooks/use-query-params';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { ArtistDataSimple } from '@/modules/artist/types';
import { Avatar, Button, Empty, Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import CustomTooltip from '../tooltip/custom-tooltip';

type Props = SelectProps & {
    fallBack?: string;
    disabledArtistIds?: string[];
    showCreate?: boolean;
    artistId?: string;
};

export default function ArtistSelect({
    fallBack,
    disabledArtistIds,
    showCreate = true,
    artistId,
    ...props
}: Props) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const messages = useTranslations();
    const queryParams = useQueryParams();
    const artistIdFromParams = queryParams['artistId'];
    // const { token } = theme.useToken();

    const {
        artistsData,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isFetching,
    } = useGetArtistSimpleList({
        pageSize: 50,
        keyword: searchKeyword,
        idInclude: artistId ?? artistIdFromParams,
    });

    // const spotify = artistsData?.map((item) => {
    //     item.artistProfiles?.map((artistProfile) => {
    //         if (artistProfile.name == 'Spotify') {
    //             return artistProfile;
    //         }
    //         return;
    //     });
    // });

    const debounceSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchKeyword(value || ' ');
            }, 300),
        [setSearchKeyword]
    );

    const options = artistsData?.map((item: ArtistDataSimple, idx) => ({
        key: `${item.id}_${idx}`,
        id: item.id,
        value: item.id,
        label: (
            <div className="flex items-center gap-1">
                <span className="truncate">
                    <CustomTooltip title={item.name}>{item.name}</CustomTooltip>
                </span>
                {/* <div className="flex gap-1">
                    <span>{item?.country?.name}</span>
                    {item?.country?.name ? '|' : ''}
                    <span>{item?.genre?.name}</span>
                </div> */}
                {/* <div className="flex justify-end gap-1">
                    <Avatar
                        size={26}
                        src="/icon/spotify.png"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                            window.open(
                                'https://open.spotify.com/',
                                '_blank',
                                'noopener'
                            );
                        }}
                    />
                    <Avatar
                        size={26}
                        src="/icon/apple-music.svg"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                            window.open(
                                'https://open.spotify.com/',
                                '_blank',
                                'noopener'
                            );
                        }}
                    />
                </div> */}
            </div>
        ),
        disabled: disabledArtistIds?.includes(item.id) ?? false,
        artistData: item,
    }));

    const optionRender = (oriOption: any) => {
        const item = oriOption.data.artistData as ArtistDataSimple;
        const disabled = oriOption.disabled;
        return (
            <div
                className={cn('grid grid-cols-3 items-center gap-1')}
                style={{
                    backgroundColor: disabled ? '#ccc' : '',
                }}
            >
                <span className="truncate">
                    <CustomTooltip title={item.name}>{item.name}</CustomTooltip>
                </span>
                <div className="flex gap-4">
                    <div className="flex flex-col text-gray-500">
                        <span>{messages('country.label')}</span>
                        <span> {messages('genre.label')}</span>
                    </div>
                    <div className="flex flex-col font-medium">
                        <span>{item?.country?.name}</span>
                        <span>{item?.genre?.name}</span>
                    </div>
                </div>
                <div className="mr-2 flex justify-end gap-1">
                    <Avatar
                        size={26}
                        src="/icon/spotify.png"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                            window.open(
                                'https://open.spotify.com/',
                                '_blank',
                                'noopener'
                            );
                        }}
                    />
                    <Avatar
                        size={26}
                        src="/icon/apple-music.svg"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                            window.open(
                                'https://open.spotify.com/',
                                '_blank',
                                'noopener'
                            );
                        }}
                    />
                </div>
            </div>
        );
    };

    useEffect(() => {
        return () => {
            debounceSearch.cancel();
        };
    }, [debounceSearch]);

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };
    return (
        <>
            <Select
                {...props}
                loading={isFetching || props?.loading}
                showSearch
                onSearch={(value) => debounceSearch(value)}
                filterOption={false}
                options={options}
                optionRender={optionRender}
                labelRender={labelRender}
                dropdownRender={(menu) => {
                    return (
                        <div>
                            {menu}
                            <div className="p-2 text-center">
                                <Spin
                                    spinning={isFetchingNextPage}
                                    size="small"
                                />
                            </div>
                            {showCreate && (
                                <div className="py-1">
                                    <Button
                                        type="primary"
                                        className="w-full"
                                        onClick={() => setOpenCreate(true)}
                                    >
                                        {messages('release.createArtist')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                }}
                // onPopupScroll={(e) => {
                //     const target = e.target as HTMLElement;
                //     if (
                //         target.scrollTop + target.offsetHeight >=
                //         target.scrollHeight - 50
                //     ) {
                //         if (hasNextPage && !isFetchingNextPage) {
                //             fetchNextPage();
                //         }
                //     }
                // }}
                notFoundContent={
                    isFetching ? (
                        <div className="min-h-5 text-center">
                            <Spin spinning={true} />
                        </div>
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )
                }
            />
            <ArtistFormModal
                open={openCreate}
                onCancel={() => setOpenCreate(false)}
            />
        </>
    );
}
