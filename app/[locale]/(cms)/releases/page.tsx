'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { setSortOrder } from '@/helpers/common';
import { useFilterV2 } from '@/hooks/use-filter-v2';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import AutoSubmitUndistributedMusicV2Modal from '@/modules/releases/components/auto-submit-undistributed-music-v2-modal';
import BulkReviewModal from '@/modules/releases/components/bulk-review-modal';
import BulkSubmitModal from '@/modules/releases/components/bulk-submit-modal';

import ReleasesHeaderV2 from '@/modules/releases/components/header';
import ReleaseStatusTabs from '@/modules/releases/components/status-tabs';
import ReleasesTable from '@/modules/releases/components/table';
import { releasesFilterParsers } from '@/modules/releases/constants';

import {
    RELEASE_TYPE,
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_STATUS,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useBulkDeleteRelease } from '@/modules/releases/hooks/use-bulk-delete-release';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';
import { DeleteVariables } from '@/types/api';
import { AuditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Space, TableProps, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString } from 'nuqs';
import { Key, useState } from 'react';

type Props = {};

export default function Releases({}: Props) {
    const {
        dataFilter,
        onChangePage,
        onChangeFilter,
        resetFilterValues,
        canClearFilter,
        defaultFilter,
    } = useFilterV2<ReleasesDataFilter>({
        // Default
        page: parseAsInteger.withDefault(1),
        pageSize: parseAsInteger.withDefault(PAGE_SIZE),
        orderBy: parseAsString.withDefault(ORDER.DESC),
        fieldOrder: parseAsString.withDefault(
            RELEASES_COLUMNS_DISPLAY.CREATED_AT
        ),
        type: parseAsString.withDefault(RELEASE_TYPE.AUDIO),
        isImportedFromReport: parseAsString.withDefault('false'),

        ...releasesFilterParsers,
    });

    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    // const isLoading = useLoading(LoadingType.Fetching);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const { token } = theme.useToken();
    const [selectedRows, setSelectedRows] = useState<Key[]>([]);
    const { isAdmin, isSystemTenant } = useAuth();
    const router = useRouter();
    const isMobile = useIsMobile();

    // apis
    const {
        releasesData,
        isFetching: isReleaseDataLoading,
        refetch,
        dataUpdatedAt,
    } = useGetListReleases(dataFilter);
    const { deleteRelease } = useDeleteRelease();
    const { bulkDeleteRelease, isPending: isBulkDeleteLoading } =
        useBulkDeleteRelease();
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

    const handleBulkDelete = (selectedRowKeys: Key[]) => {
        const drafts = releasesData?.items?.filter(
            (item) =>
                selectedRowKeys.includes(item.id) &&
                item.status === RELEASES_STATUS.DRAFT
        );

        if (drafts.length === 0) {
            openModal(TYPE_MODAL_RELEASE.BULK_DELETE, []);
            return;
        }

        openModal(
            TYPE_MODAL_RELEASE.BULK_DELETE,
            drafts.map((d) => d.id)
        );
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
                disabled: !isAdmin && record.status !== RELEASES_STATUS.DRAFT,
            };
        },
    };

    return (
        <AppPageWrapper>
            <PageContainer>
                <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
                    <ReleaseStatusTabs
                        dataFilter={dataFilter}
                        onChange={(status, extraFilter) =>
                            onChangeFilter({ status, ...extraFilter })
                        }
                    />
                    {!isSystemTenant && (
                        <PermissionGate
                            permission={PERMISSION.RELEASE_AUDIO.CREATE}
                        >
                            <CreateButton
                                text={messages('release.create')}
                                onClick={() =>
                                    router.push(APP_ROUTES.RELEASES_CREATE)
                                }
                            />
                        </PermissionGate>
                    )}
                </div>

                <ReleasesTable
                    headerTitle={
                        <ReleasesHeaderV2
                            dataFilter={dataFilter}
                            defaultFilter={defaultFilter}
                            onChangeFilter={onChangeFilter}
                            canClearFilter={canClearFilter}
                            removeFilter={resetFilterValues}
                        />
                    }
                    sticky
                    dataSource={releasesData?.items}
                    loading={isReleaseDataLoading}
                    onChangeFilter={onChangeFilter}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: releasesData?.metadata?.page || 1,
                    }}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                    options={
                        isMobile
                            ? false
                            : {
                                  reload: () => {
                                      handleRefresh();
                                  },
                              }
                    }
                    toolBarRender={
                        isMobile
                            ? () => []
                            : () => [
                                  <CreateButton
                                      canCreate={isAdmin}
                                      key="auto-submit-v2"
                                      icon={<SendOutlined />}
                                      onClick={() =>
                                          openModal(
                                              TYPE_MODAL_RELEASE.AUTO_SUBMIT_UNDISTRIBUTED_MUSIC_V2
                                          )
                                      }
                                      text={messages(
                                          'release.autoSubmitUndistributedMusic'
                                      )}
                                  />,
                              ]
                    }
                    rowSelection={rowSelection}
                    tableAlertRender={({ selectedRowKeys }) => {
                        return (
                            <Space>
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
                                <Button
                                    danger
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                        handleBulkDelete(selectedRowKeys)
                                    }
                                >
                                    {messages('release.bulkDelete')}
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<AuditOutlined />}
                                    onClick={() =>
                                        openModal(
                                            TYPE_MODAL_RELEASE.BULK_REVIEW,
                                            selectedRowKeys
                                        )
                                    }
                                >
                                    {messages('release.bulkReview')}
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

                {/* {typeModal ===
                    TYPE_MODAL_RELEASE.AUTO_SUBMIT_UNDISTRIBUTED_MUSIC && (
                    <AutoSubmitUndistributedMusicModal
                        onFinished={handleRefresh}
                    />
                )} */}

                {typeModal ===
                    TYPE_MODAL_RELEASE.AUTO_SUBMIT_UNDISTRIBUTED_MUSIC_V2 && (
                    <AutoSubmitUndistributedMusicV2Modal
                        onFinished={handleRefresh}
                    />
                )}

                {typeModal === TYPE_MODAL_RELEASE.BULK_DELETE && (
                    <AppConfirm
                        open
                        onOk={() => {
                            if ((dataEdit as Key[])?.length === 0) {
                                closeModal();
                                return;
                            }
                            bulkDeleteRelease({
                                payload: {
                                    ids: dataEdit as string[],
                                },
                                onSuccess: () => {
                                    closeModal();
                                    setSelectedRows([]);
                                },
                            });
                        }}
                        onCancel={closeModal}
                        modalTitle={messages('release.bulkDelete')}
                        loading={isBulkDeleteLoading}
                        paragraph={
                            (dataEdit as Key[])?.length === 0
                                ? messages('release.onlyDraftCanBeDeleted')
                                : messages('release.bulkDeleteConfirm', {
                                      count: (dataEdit as string[])?.length,
                                  })
                        }
                        okButtonProps={{
                            disabled: (dataEdit as Key[])?.length === 0,
                        }}
                    />
                )}

                {typeModal === TYPE_MODAL_RELEASE.BULK_REVIEW && (
                    <BulkReviewModal onFinished={() => setSelectedRows([])} />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
