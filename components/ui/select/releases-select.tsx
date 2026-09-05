import { PAGE_SIZE_LARGE } from '@/constants/page-size';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData } from '@/modules/releases/types';
import { Empty, Select, SelectProps, Spin } from 'antd';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    keyword?: string;
};

export default function ReleasesSelect({
    fallBack,
    keyword,
    ...props
}: Props) {
    const [searchKeyword, setSearchKeyword] = useState('');

    const { releasesData, isFetching } = useGetListReleases({
        pageSize: PAGE_SIZE_LARGE,
        keyword: searchKeyword || keyword || undefined,
    });

    const debounceSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchKeyword(value);
            }, 300),
        []
    );

    useEffect(() => {
        return () => {
            debounceSearch.cancel();
        };
    }, [debounceSearch]);

    const options = releasesData.items.map((item: ReleasesData) => ({
        id: item.id,
        value: item.id,
        label: item.title,
    }));

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            showSearch
            loading={isFetching || props?.loading}
            onSearch={(value) => debounceSearch(value)}
            filterOption={false}
            options={options}
            labelRender={labelRender}
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
    );
}
