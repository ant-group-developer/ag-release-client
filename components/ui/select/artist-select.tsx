import { useQueryParams } from '@/hooks/use-query-params';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { useGetArtistSimpleList } from '@/modules/artist/hooks/use-get-artist-simple-list';
import {
    ArtistData,
    ArtistDataSimple,
} from '@/modules/artist/types';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { Button, Empty, Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import CustomTooltip from '../tooltip/custom-tooltip';
import { ArtistOptionItem } from './artist-option-item';

type Props = SelectProps & {
    fallBack?: string;
    disabledArtistIds?: string[];
    showCreate?: boolean;
    artistId?: string;
    tenantId?: string;
    onCreateSuccess?: (data: ArtistData) => void;
    onUpdateSuccess?: (data: ArtistData) => void;
};

export default function ArtistSelect({
    fallBack,
    disabledArtistIds,
    showCreate = true,
    artistId,
    tenantId,
    onCreateSuccess,
    onUpdateSuccess,
    ...props
}: Props) {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const messages = useTranslations();
    const queryParams = useQueryParams();
    const artistIdFromParams = queryParams['artistId'];

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
        tenantIds: tenantId,
    });

    const debounceSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchKeyword(value || ' ');
            }, 300),
        [setSearchKeyword]
    );

    const options = artistsData?.map((item: ArtistDataSimple, idx) => {
        return {
            key: `${item.id}_${idx}`,
            id: item.id,
            value: item.id,
            label: (
                <div className="flex items-center gap-1">
                    <span className="truncate">
                        <CustomTooltip title={item.name}>
                            {item.name}
                        </CustomTooltip>
                    </span>
                </div>
            ),
            disabled: disabledArtistIds?.includes(item.id) ?? false,
            artistData: item,
        };
    });

    const optionRender = (oriOption: any) => {
        const item = oriOption.data.artistData as ArtistDataSimple;
        const disabled = oriOption.disabled;
        return (
            <ArtistOptionItem
                item={item}
                disabled={disabled}
                countryLabel={messages('country.label')}
                genreLabel={messages('genre.label')}
            />
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
                virtual={false}
                loading={isFetching || props?.loading}
                showSearch
                onSearch={(value) => debounceSearch(value)}
                filterOption={false}
                options={options}
                optionRender={optionRender}
                labelRender={labelRender}
                popupRender={(menu) => {
                    return (
                        <div>
                            {menu}
                            {isFetchingNextPage && (
                                <div className="p-2 text-center">
                                    <Spin size="small" />
                                </div>
                            )}
                            {showCreate && (
                                <PermissionGate
                                    permission={PERMISSION.ARTIST.CREATE}
                                >
                                    <div className="p-1">
                                        <Button
                                            type="primary"
                                            className="w-full"
                                            onClick={() => setOpenCreate(true)}
                                        >
                                            {messages('release.createArtist')}
                                        </Button>
                                    </div>
                                </PermissionGate>
                            )}
                        </div>
                    );
                }}
                onPopupScroll={(e) => {
                    const target = e.target as HTMLElement;
                    if (
                        target.scrollTop + target.offsetHeight >=
                        target.scrollHeight - 30
                    ) {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }
                }}
                notFoundContent={
                    isFetching ? (
                        <div className="min-h-5 text-center p-2">
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
                onCreateSuccess={(data) => {
                    setOpenCreate(false);
                    onCreateSuccess?.(data);
                }}
            />
        </>
    );
}
