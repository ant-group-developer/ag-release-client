'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { IssueLevelHeader } from '@/modules/issue-level/components/header';
import IssueLevelFormModal from '@/modules/issue-level/components/modal/issue-level-form';
import IssueLevelTable from '@/modules/issue-level/components/table';
import IssueLevelTableV2 from '@/modules/issue-level/components/table/index-v2';
import { TYPE_MODAL_ISSUE_LEVEL } from '@/modules/issue-level/enums';
import { useBulkUpdateIssueLevel } from '@/modules/issue-level/hooks/use-bulk-update';
import { useDeleteIssueLevel } from '@/modules/issue-level/hooks/use-delete';
import { useGetListIssueLevel } from '@/modules/issue-level/hooks/use-get-list';
import {
    IssueLevelData,
    IssueLevelDataFilter,
} from '@/modules/issue-level/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

type Props = {};

export default function IssueLevel({}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<IssueLevelDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { token } = theme.useToken();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<IssueLevelData>((state) => state.dataEdit);
    const { bulkUpdateIssueLevel } = useBulkUpdateIssueLevel();

    // apis
    const { issueLevelData, isFetching, refetch } =
        useGetListIssueLevel(dataFilter);
    const { deleteIssueLevel } = useDeleteIssueLevel();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<IssueLevelData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteIssueLevel(variables);
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

    const handleDragEnd = (
        preIndex: number,
        afterIndex: number,
        newData: IssueLevelData[]
    ) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            severityRank: index + 1,
        }));

        bulkUpdateIssueLevel({
            issueLevels: payload,
        });
    };

    return (
        <AppPageWrapper>
            <PageContainer title={messages('issueLevel.label')}>
                <IssueLevelHeader dataFilter={dataFilter} onSearch={onSearch} />
                <IssueLevelTable
                    sticky
                    dataSource={issueLevelData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: issueLevelData.metadata.currentPage,
                        total: issueLevelData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />

                <IssueLevelTableV2
                    sticky
                    dataSource={issueLevelData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: issueLevelData.metadata.currentPage,
                        total: issueLevelData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />

                {(typeModal === TYPE_MODAL_ISSUE_LEVEL.CREATE ||
                    typeModal === TYPE_MODAL_ISSUE_LEVEL.EDIT) && (
                    <IssueLevelFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_ISSUE_LEVEL.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDelete()}
                        onCancel={closeModal}
                        modalTitle={`${messages('common.delete')} ${messages('issueLevel.label').toLowerCase()}`}
                        paragraph={messages('delete.confirmMessage', {
                            value: getNameByLocale(
                                dataEdit?.nameEn,
                                dataEdit?.nameVi,
                                locale
                            ),
                        })}
                    />
                )}

                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    current={issueLevelData?.metadata?.currentPage}
                    pageSize={dataFilter.pageSize}
                    total={issueLevelData.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
