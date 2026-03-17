'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { LAYOUT_TABLE, ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import { LoadingType, useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import ReleasesHeaderV2 from '@/modules/releases/components/header';
import ReleasesTable from '@/modules/releases/components/table';
import ReleasesGridTable from '@/modules/releases/components/table/grid-table';

import {
    RELEASES_COLUMNS_DISPLAY,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Releases({}: Props) {
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
        orderBy: ORDER.DESC,
        fieldOrder: RELEASES_COLUMNS_DISPLAY.CREATED_AT,
    });
    const { layoutTable } = useTableLayoutToggle();
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const isLoading = useLoading(LoadingType.Fetching);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ReleasesData);
    const { token } = theme.useToken();

    // apis
    const {
        releasesData,
        isFetching: isReleaseDataLoading,
        refetch,
        dataUpdatedAt,
    } = useGetListReleases(dataFilter);
    const { deleteRelease } = useDeleteRelease();

    // func
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

    return (
        <AppPageWrapper>
            <PageContainer title={messages('release.releases')}>
                <ReleasesHeaderV2
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    dataUpdatedAt={dataUpdatedAt}
                />

                {layoutTable === LAYOUT_TABLE.LIST && (
                    <ReleasesTable
                        sticky
                        dataSource={releasesData?.items}
                        loading={isReleaseDataLoading}
                        onChangeFilter={onChangeFilter}
                        pagination={{
                            pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                            current: releasesData.metadata.page,
                        }}
                        onChange={onChangeSort}
                        dataFilter={dataFilter}
                        options={{
                            reload: () => {
                                handleRefresh();
                            },
                        }}
                    />
                )}

                {layoutTable === LAYOUT_TABLE.GRID && (
                    <ReleasesGridTable
                        data={releasesData?.items}
                        loading={isReleaseDataLoading}
                    />
                )}

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={releasesData?.metadata?.page}
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
            </PageContainer>
        </AppPageWrapper>
    );
}
