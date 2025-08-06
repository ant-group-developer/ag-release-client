'use client';
import AppContent from '@/components/ant-music/app-content';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { getScrollYHeight, setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import LanguagesHeader from '@/modules/languages/components/header';
import LanguageFormModal from '@/modules/languages/components/modal/language-form';
import { LanguagesTable } from '@/modules/languages/components/table';
import { TYPE_MODAL_LANGUAGES } from '@/modules/languages/enums';
import { useDeleteLanguage } from '@/modules/languages/hooks/use-delete-language';
import { useGetListLanguage } from '@/modules/languages/hooks/use-get-list-language';
import { LanguageDataFilter, LanguagesData } from '@/modules/languages/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Languages({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<LanguageDataFilter>({
        page: 1,
        pageSize: 21,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    const { height, width } = useWindowSize();

    // apis
    const { deleteLanguage } = useDeleteLanguage();
    const { languagesData, isLoading, refetch, lastUpdatedAt } =
        useGetListLanguage(dataFilter);

    // func
    const handleDeleteLanguage = () => {
        const variables: DeleteVariables<LanguagesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };

        deleteLanguage(variables);
    };
    const handleRefresh = () => {
        refetch();
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
        <AppContent className="overflow-hidden">
            <div className="flex-1">
                <LanguagesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <LanguagesTable
                    dataSource={languagesData?.items}
                    scroll={{ y: getScrollYHeight(height, width, 40, 38) }}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: languagesData.metadata.currentPage,
                        total: languagesData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={languagesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={languagesData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {typeModal === TYPE_MODAL_LANGUAGES.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => handleDeleteLanguage()}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name,
                    })}
                />
            )}

            {(typeModal === TYPE_MODAL_LANGUAGES.CREATE ||
                typeModal === TYPE_MODAL_LANGUAGES.UPDATE) && (
                <LanguageFormModal />
            )}
        </AppContent>
    );
}
