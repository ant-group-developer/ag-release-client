import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import { ArtistDataSimple } from '@/modules/artist/types';
import { Button, Empty, Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

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
        pageSize: 5,
        keyword: searchKeyword,
    });

    const debounceSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchKeyword(value);
            }, 300),
        [setSearchKeyword]
    );

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
            loading={isLoading}
            showSearch
            onSearch={(value) => debounceSearch(value)}
            filterOption={false}
            options={artistsData?.map((item: ArtistDataSimple, idx) => ({
                key: `${item.id}_${idx}`,
                id: item.id,
                value: item.id,
                label: item.name,
                disabled: disabledArtistIds?.includes(item.id) ?? false,
            }))}
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
