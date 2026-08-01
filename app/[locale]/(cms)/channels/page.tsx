'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import ChannelsHeader from '@/modules/channels/components/header';
import ChannelFormModal from '@/modules/channels/components/modal/channel-form';
import ChannelHistoryModal from '@/modules/channels/components/modal/channel-history-modal';
import { ChannelsTable } from '@/modules/channels/components/table';
import { TYPE_MODAL_CHANNELS } from '@/modules/channels/enums';
import { useDeleteChannel } from '@/modules/channels/hooks/use-delete-channel';
import { useGetListChannel } from '@/modules/channels/hooks/use-get-list-channel';
import { ChannelDataFilter, ChannelsData } from '@/modules/channels/types';
import { DeleteVariables } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Channels({}: Props) {
    const messages = useTranslations();
    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<ChannelDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<ChannelsData>((state) => state.dataEdit);
    const { isAdmin } = useAuth();

    const { deleteChannel } = useDeleteChannel();
    const { channelsData, isFetching, refetch, lastUpdatedAt } =
        useGetListChannel(dataFilter);

    const handleDeleteChannel = () => {
        const variables: DeleteVariables<ChannelsData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };

        deleteChannel(variables);
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
            <PageContainer title={messages('channel.label')}>
                <ChannelsTable
                    title={() => (
                        <ChannelsHeader
                            dataFilter={dataFilter}
                            onSearch={onSearch}
                            onChangeFilter={onChangeFilter}
                            handleRefresh={refetch}
                            isFetching={isFetching}
                        />
                    )}
                    sticky
                    dataSource={channelsData?.items}
                    loading={isFetching}
                    pagination={{
                        pageSize: dataFilter?.pageSize ?? PAGE_SIZE,
                        current: channelsData.metadata.page,
                        total: channelsData.metadata.totalItems,
                    }}
                    dataFilter={dataFilter}
                    onChange={onChangeSort}
                />
                <AppPagination
                    align="end"
                    current={channelsData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={channelsData?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {typeModal === TYPE_MODAL_CHANNELS.DELETE && (
                    <AppConfirm
                        open
                        onCancel={closeModal}
                        onOk={() => handleDeleteChannel()}
                        modalTitle={messages('delete.confirmTitle')}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}

                {(typeModal === TYPE_MODAL_CHANNELS.CREATE ||
                    typeModal === TYPE_MODAL_CHANNELS.UPDATE) && (
                    <ChannelFormModal />
                )}

                {typeModal === TYPE_MODAL_CHANNELS.HISTORY && (
                    <ChannelHistoryModal />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
