'use client';
import AppPagination from '@/components/ui/pagination';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import LanguagesHeader from '@/modules/languages/components/header';
import LanguageFormModal from '@/modules/languages/components/modal/language-form';
import { LanguagesTable } from '@/modules/languages/components/table';
import { fakeLanguageData } from '@/modules/languages/constants';
import { TYPE_MODAL_LANGUAGES } from '@/modules/languages/enums';
import { LanguageDataFilter } from '@/modules/languages/types';

type Props = {};

export default function Languages({}: Props) {
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<LanguageDataFilter>({
        page: 1,
        pageSize: 10,
    });
    const typeModal = useModalStore((state) => state.typeModal);

    const handleRefresh = () => {};

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
                    dataSource={fakeLanguageData}
                    scroll={{ x: 600, y: 400 }}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeLanguageData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />

            {(typeModal === TYPE_MODAL_LANGUAGES.CREATE ||
                typeModal === TYPE_MODAL_LANGUAGES.UPDATE) && (
                <LanguageFormModal />
            )}
        </div>
    );
}
