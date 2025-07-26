'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { PAGE_SIZE } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import TimezoneHeader from '@/modules/timezone/components/header';
import TimezoneFormModal from '@/modules/timezone/components/modal/timezone-form';
import { TimezoneTable } from '@/modules/timezone/components/table';
import { TYPE_MODAL_TIMEZONE } from '@/modules/timezone/enums';
import { useDeleteTimezone } from '@/modules/timezone/hooks/use-delete-timezone';
import { useGetListTimezones } from '@/modules/timezone/hooks/use-get-list-timezones';
import { TimezoneData } from '@/modules/timezone/types';
import { DeleteVariables } from '@/types/api';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Timezone({}: Props) {
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<any>({
        page: 1,
        pageSize: 21,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);

    const { deleteTimezone } = useDeleteTimezone();
    const { timezonesData, isLoading, refetch, lastUpdatedAt } =
        useGetListTimezones(dataFilter);

    const handleDeleteTimezone = () => {
        const variables: DeleteVariables<TimezoneData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };

        deleteTimezone(variables);
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

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <TimezoneHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={() => handleRefresh()}
                    lastUpdatedAt={lastUpdatedAt}
                />
                <TimezoneTable
                    dataSource={timezonesData?.items}
                    scroll={{ y: scrollY() }}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: timezonesData.metadata.currentPage,
                        total: timezonesData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
            </div>
            <AppPagination
                className="border-b border-t"
                align="end"
                current={timezonesData?.metadata?.currentPage}
                pageSize={dataFilter.pageSize}
                total={timezonesData?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
            {typeModal === TYPE_MODAL_TIMEZONE.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={() => handleDeleteTimezone()}
                    modalTitle={modalTitle}
                    paragraph={modalParagraph}
                />
            )}
            {(typeModal === TYPE_MODAL_TIMEZONE.CREATE ||
                typeModal === TYPE_MODAL_TIMEZONE.UPDATE) && (
                <TimezoneFormModal />
            )}
        </div>
    );
}
