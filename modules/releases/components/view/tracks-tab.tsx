import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackDataFilter } from '@/modules/tracks/types';
import { CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import TracksCollapse from './tracks-collapse';

type Props = {
    releaseId: string;
};

export default function TracksTab({ releaseId }: Props) {
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const messages = useTranslations();

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
        onSearch,
    } = useFilter<TrackDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        releaseId: releaseId,
    });

    const { tracksData, isFetching, refetch } = useGetListTracks(dataFilter);

    const [activeKeys, setActiveKeys] = useState<string[]>([]);

    const allKeys = useMemo(
        () => (tracksData?.items || []).map((_, index) => String(index)),
        [tracksData?.items]
    );

    const isAllExpanded = useMemo(
        () =>
            allKeys.length > 0 &&
            allKeys.every((key) => activeKeys.includes(key)),
        [allKeys, activeKeys]
    );

    const handleToggleAll = () => {
        if (isAllExpanded) {
            setActiveKeys([]);
        } else {
            setActiveKeys(allKeys);
        }
    };

    const handleCollapseChange = (keys: string | string[]) => {
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
    };

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between">
                <AppSearch
                    className="max-w-52"
                    onChange={onSearch}
                    defaultValue={dataFilter.keyword}
                />
                <Button
                    icon={
                        isAllExpanded ? (
                            <CompressOutlined />
                        ) : (
                            <ExpandOutlined />
                        )
                    }
                    onClick={handleToggleAll}
                    disabled={allKeys.length === 0}
                >
                    {isAllExpanded
                        ? messages('common.collapseAll')
                        : messages('common.expandAll')}
                </Button>
            </div>

            <TracksCollapse
                tracks={tracksData?.items || []}
                page={tracksData?.metadata?.page}
                pageSize={dataFilter.pageSize}
                activeKey={activeKeys}
                onChange={handleCollapseChange}
                loading={isFetching}
            />

            <AppPagination
                className="rounded-lg"
                style={{ background: token.colorBgContainer }}
                align="end"
                current={tracksData?.metadata?.page}
                pageSize={dataFilter.pageSize}
                total={tracksData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
