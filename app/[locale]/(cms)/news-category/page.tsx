'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import { PAGE_SIZE } from '@/constants/page-size';
import { getNameByLocale } from '@/helpers/string';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { NewsCategoryHeader } from '@/modules/news-category/components/header';
import NewsCategoryFormModal from '@/modules/news-category/components/modal/news-category-form';
import NewsCategoryTable from '@/modules/news-category/components/table';
import { TYPE_MODAL_NEWS_CATEGORY } from '@/modules/news-category/enums';
import { useDeleteNewsCategory } from '@/modules/news-category/hooks/use-delete';
import { useGetTreeNewsCategory } from '@/modules/news-category/hooks/use-get-tree';
import {
    NewsCategoryData,
    NewsCategoryDataFilter,
} from '@/modules/news-category/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

type Props = {};

export default function NewsCategory({}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { dataFilter, onChangeFilter, onSearch } =
        useFilter<NewsCategoryDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<NewsCategoryData>((state) => state.dataEdit);

    // apis
    const { newsCategoryTreeData, isFetching, refetch } =
        useGetTreeNewsCategory();
    const { deleteNewsCategory } = useDeleteNewsCategory();

    const filteredTreeData = useMemo(() => {
        const cleanEmptyChildren = (
            list: NewsCategoryData[],
            depth = 0
        ): NewsCategoryData[] => {
            return list.map((item) => {
                const cleaned: NewsCategoryData & { depth?: number } = {
                    ...item,
                    depth,
                };
                if (cleaned.children && cleaned.children.length > 0) {
                    cleaned.children = cleanEmptyChildren(
                        cleaned.children,
                        depth + 1
                    );
                } else {
                    delete cleaned.children;
                }
                return cleaned;
            });
        };

        const rawTree = cleanEmptyChildren(newsCategoryTreeData);

        if (!dataFilter.keyword) return rawTree;
        const filterTree = (
            list: NewsCategoryData[],
            depth = 0
        ): NewsCategoryData[] => {
            const lowerKeyword = dataFilter.keyword!.toLowerCase();
            return list
                .map((item) => ({
                    ...item,
                    depth,
                    children: item.children
                        ? filterTree(item.children, depth + 1)
                        : undefined,
                }))
                .filter((item) => {
                    const nameViMatches = item.nameVi
                        ?.toLowerCase()
                        .includes(lowerKeyword);
                    const nameEnMatches = item.nameEn
                        ?.toLowerCase()
                        .includes(lowerKeyword);
                    const descriptionViMatches = item.descriptionVi
                        ?.toLowerCase()
                        .includes(lowerKeyword);
                    const descriptionEnMatches = item.descriptionEn
                        ?.toLowerCase()
                        .includes(lowerKeyword);
                    const hasMatchingChildren =
                        item.children && item.children.length > 0;

                    return (
                        nameViMatches ||
                        nameEnMatches ||
                        descriptionViMatches ||
                        descriptionEnMatches ||
                        hasMatchingChildren
                    );
                });
        };
        return filterTree(rawTree);
    }, [newsCategoryTreeData, dataFilter.keyword]);

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
    return (
        <AppPageWrapper>
            <PageContainer title={messages('newsCategory.label')}>
                <NewsCategoryTable
                    headerTitle={
                        <NewsCategoryHeader
                            dataFilter={dataFilter}
                            onChangeFilter={onChangeFilter}
                            onSearch={onSearch}
                        />
                    }
                    toolBarRender={() => [
                        <CreateButton
                            key="create"
                            canCreate={true}
                            text={messages('action.create.button')}
                            onClick={() =>
                                openModal(TYPE_MODAL_NEWS_CATEGORY.CREATE)
                            }
                        />,
                    ]}
                    sticky
                    dataSource={filteredTreeData}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    options={false}
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
            </PageContainer>
        </AppPageWrapper>
    );
}
