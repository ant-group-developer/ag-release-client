'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { getNameByLocale } from '@/helpers/string';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { NewsHeader } from '@/modules/news/components/header';
import NewsFormModal from '@/modules/news/components/modal/news-form';
import NewsTable from '@/modules/news/components/table';
import { TYPE_MODAL_NEWS } from '@/modules/news/enums';
import { useDeleteNews } from '@/modules/news/hooks/use-delete';
import { useGetListNews } from '@/modules/news/hooks/use-get-list';
import { NewsData, NewsDataFilter } from '@/modules/news/types';
import { DeleteVariables } from '@/types/api';
import { useLocale, useTranslations } from 'next-intl';

type Props = {};

export default function News({}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        onSearch,
        canClearFilter,
        removeFilter,
    } = useFilter<NewsDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<NewsData>((state) => state.dataEdit);

    // apis
    const { newsData, isFetching, refetch } = useGetListNews(dataFilter);
    const { deleteNews } = useDeleteNews();

    // func
    const handleDelete = () => {
        const variables: DeleteVariables<NewsData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteNews(variables);
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
        <div>
            <NewsHeader
                dataFilter={dataFilter}
                onSearch={onSearch}
                canClearFilter={canClearFilter}
                onChangeFilter={onChangeFilter}
                removeFilter={removeFilter}
            />
            <NewsTable
                sticky
                dataSource={newsData?.items}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: newsData.metadata.currentPage,
                    total: newsData.metadata.totalItems,
                }}
                loading={false}
                dataFilter={dataFilter}
                onChange={onChangeSort}
                scroll={{ x: SCREEN.XL }}
            />

            {(typeModal === TYPE_MODAL_NEWS.CREATE ||
                typeModal === TYPE_MODAL_NEWS.EDIT) && (
                <NewsFormModal open onCancel={closeModal} />
            )}

            {typeModal === TYPE_MODAL_NEWS.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDelete()}
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} ${messages('news.label').toLowerCase()}`}
                    paragraph={messages('delete.confirmMessage', {
                        value: getNameByLocale(
                            dataEdit?.titleEn,
                            dataEdit?.titleEn,
                            locale
                        ),
                    })}
                />
            )}

            <AppPagination
                align="end"
                current={newsData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={newsData.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
