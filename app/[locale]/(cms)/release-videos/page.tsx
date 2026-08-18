'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import ReleaseVideoHeader from '@/modules/release-video/components/header';
import { ReleaseVideoTable } from '@/modules/release-video/components/table';
import { TYPE_MODAL_RELEASE_VIDEO } from '@/modules/release-video/enums';
import {
    RELEASE_TYPE,
    RELEASES_STATUS,
    RELEASES_TABLE_KEY,
} from '@/modules/releases/enums';
import { useBulkSubmitRelease } from '@/modules/releases/hooks/use-bulk-submit-release';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { DeleteVariables } from '@/types/api';
import { SendOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, TableProps } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

export default function ReleaseVideos() {
    // hooks - state
    const messages = useTranslations();
    const {
        dataFilter,
        defaultFilter,
        onChangeFilter,
        onChangePage,
        onSearch,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleasesDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        type: RELEASE_TYPE.VIDEO,
        orderBy: ORDER.DESC,
        fieldOrder: RELEASES_TABLE_KEY.UPDATED_AT,
        isImportedFromReport: 'false',
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore<ReleasesData | Key[]>((state) => state.dataEdit);
    const [selectedRows, setSelectedRows] = useState<Key[]>([]);

    // apis
    const { releasesData, isFetching, refetch } = useGetListReleases(dataFilter);
    const { deleteRelease } = useDeleteRelease();
    const { bulkSubmitRelease, isPending: isBulkSubmitting } =
        useBulkSubmitRelease();

    // func
    const handleDeleteReleaseVideo = () => {
        const release = dataEdit as ReleasesData;
        const variables: DeleteVariables<ReleasesData['id']> = {
            id: release?.id,
            onSuccess: () => {
                closeModal();
            },
            onError: () => {},
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
                disabled: record.status !== RELEASES_STATUS.FAILED,
            };
        },
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('releaseVideo.routeLabel')}>
                <ReleaseVideoTable
                    headerTitle={
                        <ReleaseVideoHeader
                            dataFilter={dataFilter}
                            defaultFilter={defaultFilter}
                            onChangeFilter={onChangeFilter}
                            canClearFilter={canClearFilter}
                            removeFilter={removeFilter}
                            onSearch={onSearch}
                        />
                    }
                    sticky
                    dataSource={releasesData.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releasesData.metadata.page,
                        total: releasesData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                    rowSelection={rowSelection}
                    options={{
                        reload: () => {
                            refetch();
                        },
                    }}
                    tableAlertRender={({ selectedRowKeys }) => {
                        return (
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={() =>
                                        openModal(
                                            TYPE_MODAL_RELEASE_VIDEO.BULK_SUBMIT,
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
                    align="end"
                    current={releasesData.metadata?.page}
                    pageSize={dataFilter?.pageSize}
                    total={releasesData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_RELEASE_VIDEO.DELETE && (
                    <AppConfirm
                        open
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: (dataEdit as ReleasesData)?.title,
                        })}
                        onCancel={closeModal}
                        onOk={() => handleDeleteReleaseVideo()}
                    />
                )}

                {typeModal === TYPE_MODAL_RELEASE_VIDEO.BULK_SUBMIT && (
                    <AppConfirm
                        open
                        typeDelete={false}
                        onOk={() => {
                            const ids =
                                (dataEdit as string[]) ||
                                (selectedRows as string[]) ||
                                [];
                            if (ids.length === 0) return;
                            bulkSubmitRelease({
                                payload: {
                                    ids,
                                    codes: ['vevo'],
                                },
                                onSuccess: () => {
                                    closeModal();
                                    setSelectedRows([]);
                                },
                            });
                        }}
                        onCancel={closeModal}
                        modalTitle={messages('release.bulkSubmit')}
                        loading={isBulkSubmitting}
                        paragraph={messages('release.bulkSubmitConfirm', {
                            count:
                                (dataEdit as Key[])?.length ||
                                selectedRows.length,
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
