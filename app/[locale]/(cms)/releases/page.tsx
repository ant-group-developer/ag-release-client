'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { LoadingType, useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import BulkSubmitModal from '@/modules/releases/components/bulk-submit-modal';
import ReleasesHeaderV2 from '@/modules/releases/components/header';
import ReleasesTable from '@/modules/releases/components/table';

import {
    RELEASES_COLUMNS_DISPLAY,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { DeleteVariables } from '@/types/api';
import { SendOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, TableProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

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
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const isLoading = useLoading(LoadingType.Fetching);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const { token } = theme.useToken();
    const [selectedRows, setSelectedRows] = useState<Key[]>([]);
    const { isAdmin } = useAuth();

    // apis
    const {
        releasesData,
        isFetching: isReleaseDataLoading,
        refetch,
        dataUpdatedAt,
    } = useGetListReleases(dataFilter);
    const { deleteRelease } = useDeleteRelease();
    // const { isPending: isExportTemplateCiLoading } = useExportTemplateCi();

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteRelease = () => {
        const release = dataEdit as ReleasesData;
        const variables: DeleteVariables<ReleasesData['id']> = {
            id: release?.id,
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

    const rowSelection: TableProps<ReleasesData>['rowSelection'] = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys: Key[]) => {
            setSelectedRows(selectedRowKeys);
        },
        getCheckboxProps: (record: ReleasesData) => {
            return {
                disabled: !isAdmin,
            };
        },
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('release.releases')}>
                {/* <ReleasesHeaderV2
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                /> */}

                <ReleasesTable
                    headerTitle={
                        <ReleasesHeaderV2
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            canClearFilter={canClearFilter}
                            removeFilter={removeFilter}
                        />
                    }
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
                    rowSelection={rowSelection}
                    tableAlertRender={({ selectedRowKeys }) => {
                        return (
                            <Space>
                                {/* <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={() =>
                                        openModal(
                                            TYPE_MODAL_RELEASE.EXPORT_TEMPLATE,
                                            selectedRowKeys
                                        )
                                    }
                                    loading={isExportTemplateCiLoading}
                                >
                                    {messages('release.exportCiTemplate')}
                                </Button> */}
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={() =>
                                        openModal(
                                            TYPE_MODAL_RELEASE.BULK_SUBMIT,
                                            selectedRowKeys
                                        )
                                    }
                                >
                                    {messages('release.bulkSubmit')}
                                </Button>
                            </Space>
                        );
                    }}
                />

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
                            value: (dataEdit as ReleasesData)?.title,
                        })}
                    />
                )}
                {/* 
                {typeModal === TYPE_MODAL_RELEASE.EXPORT_TEMPLATE && (
                    <ExportTemplateModal
                        onFinished={() => setSelectedRows([])}
                    />
                )} */}

                {typeModal === TYPE_MODAL_RELEASE.BULK_SUBMIT && (
                    <BulkSubmitModal onFinished={() => setSelectedRows([])} />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
