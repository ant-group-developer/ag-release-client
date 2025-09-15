import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { ArtistDataSimple } from '@/modules/artist/types';
import { Avatar, Button, Empty, Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import CustomTooltip from '../tooltip/custom-tooltip';

type Props = SelectProps & {
    onCreateArtist?: () => void;
    fallBack?: string;
    disabledArtistIds?: string[];
};

export default function ArtistSelect({
    fallBack,
    disabledArtistIds,
    onCreateArtist,
    ...props
}: Props) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const messages = useTranslations();

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
    });

    const debounceSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchKeyword(value);
            }, 300),
        [setSearchKeyword]
    );

    const options = artistsData?.map((item: ArtistDataSimple, idx) => ({
        key: `${item.id}_${idx}`,
        id: item.id,
        value: item.id,
        label: (
            <div className="grid grid-cols-3 items-center gap-1">
                <span className="truncate">
                    <CustomTooltip title={item.name}>{item.name}</CustomTooltip>
                </span>
                <div className="flex gap-1">
                    {/* <span>{item?.country?.name}</span>
                    <span>{item?.genre?.name}</span> */}
                    <span>{'Việt Nam'}</span> | <span>{'Rap hiphop'}</span>
                </div>
                <div className="flex justify-end gap-1">
                    <Avatar
                        size={26}
                        src="/icon/spotify.png"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                        }}
                    />
                    <Avatar
                        size={26}
                        src="/icon/apple-music.svg"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                        }}
                    />
                </div>
            </div>
        ),
        disabled: disabledArtistIds?.includes(item.id) ?? false,
    }));

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
        <Select
            {...props}
            className={''}
            loading={isFetching}
            showSearch
            onSearch={(value) => debounceSearch(value)}
            filterOption={false}
            options={options}
            labelRender={labelRender}
            dropdownRender={(menu) => {
                return (
                    <div>
                        {menu}
                        <div className="p-2 text-center">
                            <Spin spinning={isFetchingNextPage} size="small" />
                        </div>
                        <div className="py-1">
                            <Button
                                type="primary"
                                className="w-full"
                                onClick={onCreateArtist}
                            >
                                {messages('release.createArtist')}
                            </Button>
                        </div>
                    </div>
                );
            }}
            onPopupScroll={(e) => {
                const target = e.target as HTMLElement;
                if (
                    target.scrollTop + target.offsetHeight >=
                    target.scrollHeight - 50
                ) {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }
            }}
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
    );
}
