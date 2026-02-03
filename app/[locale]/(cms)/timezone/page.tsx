'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
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
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Timezone({}: Props) {
    // hooks - state
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<any>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);
    // const { height, width } = useWindowSize();

    // apis
    const { deleteTimezone } = useDeleteTimezone();
    const { timezonesData, isFetching, refetch, lastUpdatedAt } =
        useGetListTimezones(dataFilter);

    // func
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

    return (
        <AppPageWrapper>
            <PageContainer title={messages('timezone.label')}>
                <TimezoneTable
                    title={() => (
                        <TimezoneHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                        />
                    )}
                    sticky
                    dataSource={timezonesData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: timezonesData.metadata.page,
                        total: timezonesData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    className="border-b"
                    align="end"
                    current={timezonesData?.metadata?.page}
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
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}
                {(typeModal === TYPE_MODAL_TIMEZONE.CREATE ||
                    typeModal === TYPE_MODAL_TIMEZONE.UPDATE) && (
                    <TimezoneFormModal />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
