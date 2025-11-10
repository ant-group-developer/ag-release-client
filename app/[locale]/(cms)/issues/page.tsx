'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import IssueLevelSelect from '@/components/ui/select/issue-level-select';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import IssueFormModal from '@/modules/issues/components/modal/issue-form';
import IssueTable from '@/modules/issues/components/table';
import { TYPE_MODAL_ISSUES } from '@/modules/issues/enums';
import { useDeleteIssue } from '@/modules/issues/hooks/use-delete';
import { useGetListIssue } from '@/modules/issues/hooks/use-get-list';
import { IssueData, IssueDataFilter } from '@/modules/issues/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

type Props = {};

export default function Issues({}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { token } = theme.useToken();
    const openModal = useModalStore((state) => state.openModal);
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<IssueDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<IssueData>((state) => state.dataEdit);

    // apis
    const { issueData, isFetching, refetch } = useGetListIssue(dataFilter);
    const { deleteIssue } = useDeleteIssue();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<IssueData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteIssue(variables);
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
                title={messages('issue.label')}
                extra={
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.button')}
                        onClick={() => openModal(TYPE_MODAL_ISSUES.CREATE)}
                    />
                }
            >
                {/* <IssueHeader
                    dataFilter={dataFilter}
                    onSearch={onSearch}
                    onChangeFilter={onChangeFilter}
                /> */}
                <IssueTable
                    headerTitle={
                        <div className="flex items-center gap-2">
                            <AppSearch
                                className="max-w-52"
                                onChange={onSearch}
                                defaultValue={dataFilter.keyword}
                            />
                            <IssueLevelSelect
                                placeholder={messages('issueLevel.label')}
                                className="min-w-44"
                                allowClear
                                onChange={(e) =>
                                    onChangeFilter({ issueLevelId: e })
                                }
                            />
                        </div>
                    }
                    sticky
                    dataSource={issueData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: issueData.metadata.currentPage,
                        total: issueData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                    options={{
                        reload: () => {
                            handleRefresh();
                        },
                    }}
                />

                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    current={issueData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={issueData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_ISSUES.CREATE ||
                    typeModal === TYPE_MODAL_ISSUES.EDIT) && (
                    <IssueFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_ISSUES.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDelete()}
                        onCancel={closeModal}
                        modalTitle={`${messages('common.delete')} ${messages('issue.label').toLowerCase()}`}
                        paragraph={messages('delete.confirmMessage', {
                            value: getNameByLocale(
                                dataEdit?.nameEn,
                                dataEdit?.nameVi,
                                locale
                            ),
                        })}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
