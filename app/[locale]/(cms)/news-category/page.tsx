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
import { NewsCategoryHeader } from '@/modules/news-category/components/header';
import NewsCategoryFormModal from '@/modules/news-category/components/modal/news-category-form';
import NewsCategoryTable from '@/modules/news-category/components/table';
import { TYPE_MODAL_NEWS_CATEGORY } from '@/modules/news-category/enums';
import { useDeleteNewsCategory } from '@/modules/news-category/hooks/use-delete';
import { useGetListNewsCategory } from '@/modules/news-category/hooks/use-get-list';
import {
    NewsCategoryData,
    NewsCategoryDataFilter,
} from '@/modules/news-category/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useLocale, useTranslations } from 'next-intl';

type Props = {};

export default function NewsCategory({}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { token } = theme.useToken();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<NewsCategoryDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    // const openModal = useModalStore((state) => state.openModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<NewsCategoryData>((state) => state.dataEdit);

    // apis
    const { newsCategoryData, isFetching, refetch } =
        useGetListNewsCategory(dataFilter);
    const { deleteNewsCategory } = useDeleteNewsCategory();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<NewsCategoryData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteNewsCategory(variables);
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
            <PageContainer title={messages('newsCategory.label')}>
                <NewsCategoryTable
                    title={() => (
                        <NewsCategoryHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={newsCategoryData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: newsCategoryData.metadata.page,
                        total: newsCategoryData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />

                {(typeModal === TYPE_MODAL_NEWS_CATEGORY.CREATE ||
                    typeModal === TYPE_MODAL_NEWS_CATEGORY.EDIT) && (
                    <NewsCategoryFormModal onCancel={closeModal} />
                )}

                {typeModal === TYPE_MODAL_NEWS_CATEGORY.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDelete()}
                        onCancel={closeModal}
                        modalTitle={`${messages('common.delete')} ${messages('newsCategory.label').toLowerCase()}`}
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
                    current={newsCategoryData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={newsCategoryData.metadata?.totalItems}
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
