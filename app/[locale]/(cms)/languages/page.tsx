'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
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

    const { deleteLanguage } = useDeleteLanguage();

    const handleDeleteLanguage = () => {
        const variables: DeleteVariables<LanguagesData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };

        deleteLanguage(variables);
    };

    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;
    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const appHeaderHeight = 65;
        const pageHeaderHeight = 53;
        const tableHeaderHeight = 39;
        const paginationHeight = 55;
        const value =
            height -
            appHeaderHeight -
            pageHeaderHeight -
            tableHeaderHeight -
            paginationHeight;

        return value > minHeight ? value : minHeight;
    };

    const modalTitle = `${messages('delete.confirmTitle')}`;
    const modalParagraph = `${messages('delete.confirmMessage', { value: dataEdit?.name })}`;

    const handleRefresh = () => {};

    const { languagesData, isLoading } = useGetListLanguage(dataFilter);

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <LanguagesHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <LanguagesTable
                    dataSource={languagesData?.items}
                    scroll={{ x: SCREEN.MD, y: scrollY() }}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: languagesData.metadata.currentPage,
                        total: languagesData.metadata.totalItems,
                    }}
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
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                />
            )}

            {(typeModal === TYPE_MODAL_LANGUAGES.CREATE ||
                typeModal === TYPE_MODAL_LANGUAGES.UPDATE) && (
                <LanguageFormModal />
            )}
        </div>
    );
}
