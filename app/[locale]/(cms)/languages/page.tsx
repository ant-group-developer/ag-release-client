'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
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
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Languages({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<LanguageDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<LanguagesData>((state) => state.dataEdit);

    // apis
    const { deleteLanguage } = useDeleteLanguage();
    const { languagesData, isFetching, refetch, lastUpdatedAt } =
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
        <AppPageWrapper>
            <PageContainer title={messages('language.label')}>
                <LanguagesTable
                    title={() => (
                        <LanguagesHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={languagesData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: languagesData.metadata.page,
                        total: languagesData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    align="end"
                    current={languagesData?.metadata?.page}
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
            </PageContainer>
        </AppPageWrapper>
    );
}
