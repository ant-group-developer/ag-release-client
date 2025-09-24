'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, ORDER, SESSION_STORAGE_KEY } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { LoadingType, useLoading } from '@/hooks/use-loading';
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
        pageSize: PAGE_SIZE,
    });
    const { layoutTable } = useTableLayoutToggle();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const isLoading = useLoading(LoadingType.Fetching);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ReleasesData);

    // apis
    const {
        releasesData,
        isFetching: isReleaseDataLoading,
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
    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
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
        <div>
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
                    sticky
                    visibleColumns={visibleColumns}
                    dataSource={releasesData?.items}
                    loading={isReleaseDataLoading}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releasesData.metadata.currentPage,
                    }}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                />
            )}

            {layoutTable === LAYOUT_TABLE.GRID && (
                <ReleasesGridTable
                    data={releasesData?.items}
                    loading={isReleaseDataLoading}
                />
            )}

            <AppPagination
                className="border-b"
                align="end"
                current={releasesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={releasesData?.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_RELEASE.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDeleteRelease()}
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} ${messages('release.label').toLowerCase()}`}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.title,
                    })}
                />
            )}
        </div>
    );
}
