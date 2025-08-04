'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { LAYOUT_TABLE, SCREEN, SESSION_STORAGE_KEY } from '@/enums/common';
import { getScrollYHeight } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import ReleasesHeader from '@/modules/releases/components/header';
import ReleasesTable from '@/modules/releases/components/table';
import ReleasesGridTable from '@/modules/releases/components/table/grid-table';
import { defaultVisibleColumnsReleases } from '@/modules/releases/constants';
import {
    RELEASES_COLUMNS_DISPLAY,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props = {};

export default function Releases({}: Props) {
    // hooks - state
    const [visibleColumns, setVisibleColumns] = useState<
        RELEASES_COLUMNS_DISPLAY[]
    >(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_RELEASES
            );
            if (!stored) return defaultVisibleColumnsReleases;
            const { value, timestamp } = JSON.parse(stored) as {
                value: RELEASES_COLUMNS_DISPLAY[];
                timestamp: string;
            };

            if (dayjs().diff(dayjs(timestamp), 'day') >= 10) {
                sessionStorage.removeItem(
                    SESSION_STORAGE_KEY.VISIBLE_COLUMNS_RELEASES
                );
                return defaultVisibleColumnsReleases;
            }

            return value;
        }
        return defaultVisibleColumnsReleases;
    });
    const {
        dataFilter,
        onSearch,
        onChangePage,
        onChangeFilter,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleasesDataFilter>({
        page: 1,
        pageSize: 21,
    });
    const { height, width } = useWindowSize();
    const { layoutTable } = useTableLayoutToggle();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const isLoading = useLoading(UseLoadingType.Fetching);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ReleasesData);

    // apis
    const {
        releasesData,
        isPending: isReleaseDataLoading,
        refetch,
        dataUpdatedAt,
    } = useGetListReleases(dataFilter);
    const { deleteRelease } = useDeleteRelease();

    // func
    const handleChangeVisibleColumns = (
        columns: RELEASES_COLUMNS_DISPLAY[]
    ) => {
        setVisibleColumns(columns);
    };
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteRelease = () => {
        const variables: DeleteVariables<ReleasesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteRelease(variables);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_RELEASES,
                JSON.stringify({
                    value: visibleColumns,
                    timestamp: dayjs().toISOString(),
                })
            );
        }
    }, [visibleColumns]);

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <ReleasesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                    dataUpdatedAt={dataUpdatedAt}
                />
                {layoutTable === LAYOUT_TABLE.LIST && (
                    <ReleasesTable
                        visibleColumns={visibleColumns}
                        dataSource={releasesData?.items}
                        scroll={{
                            x: SCREEN.MD,
                            y: getScrollYHeight(height, width, 40, 38),
                        }}
                        loading={isReleaseDataLoading}
                        onChangeFilter={onChangeFilter}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <ReleasesGridTable
                        data={releasesData?.items}
                        loading={false}
                    />
                )}
            </div>

            <AppPagination
                className="border-b border-t"
                align="end"
                current={releasesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={releasesData?.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 35]}
            />

            {typeModal === TYPE_MODAL_RELEASE.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDeleteRelease()}
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} ${messages('releases.label').toLowerCase()}`}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.title,
                    })}
                />
            )}
        </div>
    );
}
