'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import IssueLevelSelect from '@/components/ui/select/issue-level-select';
import IssueSelect from '@/components/ui/select/issue-select';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import useModalStore from '@/hooks/use-modal';
import TenantIssueFormModal from '@/modules/tenant-issue/components/modal/tenant-issue-form';
import TenantIssueTable from '@/modules/tenant-issue/components/table';
import { tenantIssuesQueryKeys } from '@/modules/tenant-issue/constants/query-keys';
import { TYPE_MODAL_TENANT_ISSUES } from '@/modules/tenant-issue/enums';
import { useDeleteTenantIssue } from '@/modules/tenant-issue/hooks/use-delete';
import { useGetListTenantIssue } from '@/modules/tenant-issue/hooks/use-get-list';
import {
    TenantIssueData,
    TenantIssueDataFilter,
} from '@/modules/tenant-issue/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function TenantIssue({}: Props) {
    const messages = useTranslations();
    // const locale = useLocale();
    const { token } = theme.useToken();

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        onSearch,
        removeFilter,
        canClearFilter,
    } = useFilter<TenantIssueDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const { isLoading } = useLoadingStatus({
        queryKeys: [tenantIssuesQueryKeys.lists()],
        mutationKeys: [tenantIssuesQueryKeys.all],
    });
    const openModal = useModalStore((state) => state.openModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TenantIssueData>((state) => state.dataEdit);

    // apis
    const { tenantIssueData, isFetching, refetch } =
        useGetListTenantIssue(dataFilter);
    const { deleteTenantIssue } = useDeleteTenantIssue();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<TenantIssueData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteTenantIssue(variables);
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
    const handleRefresh = () => {
        refetch();
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('tenantIssue.label')}
                extra={
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.button')}
                        onClick={() =>
                            openModal(TYPE_MODAL_TENANT_ISSUES.CREATE)
                        }
                    />
                }
            >
                {/* <TenantIssueHeader
                    dataFilter={dataFilter}
                    onSearch={onSearch}
                    canClearFilter={canClearFilter}
                    onChangeFilter={onChangeFilter}
                    removeFilter={removeFilter}
                /> */}
                <TenantIssueTable
                    headerTitle={
                        <div className="flex gap-2">
                            <AppSearch
                                className="w-52 flex-shrink-0"
                                onChange={onSearch}
                                defaultValue={dataFilter.keyword}
                            />
                            <IssueLevelSelect
                                placeholder={messages('issueLevel.label')}
                                className="min-w-48 flex-shrink-0"
                                allowClear
                                onChange={(e) =>
                                    onChangeFilter({ issueLevelId: e })
                                }
                            />
                            <IssueSelect
                                placeholder={messages('issue.label')}
                                className="min-w-48 flex-shrink-0"
                                allowClear
                                onChange={(e) => onChangeFilter({ issueId: e })}
                            />
                        </div>
                    }
                    sticky
                    dataSource={tenantIssueData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: tenantIssueData.metadata.currentPage,
                        total: tenantIssueData.metadata.totalItems,
                    }}
                    loading={isLoading}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                <AppPagination
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    className="rounded-b-lg"
                    align="end"
                    current={tenantIssueData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={tenantIssueData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_TENANT_ISSUES.CREATE ||
                    typeModal === TYPE_MODAL_TENANT_ISSUES.EDIT) && (
                    <TenantIssueFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_TENANT_ISSUES.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDelete()}
                        onCancel={closeModal}
                        modalTitle={`${messages('common.delete')} ${messages('tenantIssue.label').toLowerCase()}`}
                        paragraph={messages('delete.confirmMessage', {
                            value: '',
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
