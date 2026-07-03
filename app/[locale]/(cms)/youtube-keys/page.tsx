'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import { PAGE_SIZE } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import YoutubeKeyFormModal from '@/modules/youtube-keys/components/modal/youtube-key-form';
import { YoutubeKeysTable } from '@/modules/youtube-keys/components/table';
import { TYPE_MODAL_YOUTUBE_KEYS } from '@/modules/youtube-keys/enums';
import { useGetListYoutubeKeys } from '@/modules/youtube-keys/hooks/use-get-list-youtube-keys';
import { SyncOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {};

export default function YoutubeKeysPage({}: Props) {
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const openModal = useModalStore((state) => state.openModal);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const { youtubeKeysData, isFetching, refetch } = useGetListYoutubeKeys();

    const onChangeSort = (pagination: any) => {
        if (pagination) {
            setPage(pagination.current || 1);
            setPageSize(pagination.pageSize || PAGE_SIZE);
        }
    };

    // client-side pagination
    const paginatedData = (youtubeKeysData ?? []).slice(
        (page - 1) * pageSize,
        page * pageSize
    );
    const totalItems = (youtubeKeysData ?? []).length;

    return (
        <AppPageWrapper>
            <PageContainer title={messages('youtubeKeys.label')}>
                <YoutubeKeysTable
                    sticky
                    dataSource={paginatedData}
                    loading={isFetching}
                    pagination={{
                        pageSize: pageSize,
                        current: page,
                        total: totalItems,
                    }}
                    onChange={onChangeSort}
                    title={() => (
                        <div className="flex justify-end gap-2">
                            <Button
                                key="refresh"
                                icon={<SyncOutlined />}
                                onClick={() => refetch()}
                                loading={isFetching}
                            >
                                {messages('common.refresh')}
                            </Button>
                            <CreateButton
                                key="create"
                                canCreate={true}
                                text={messages('common.create')}
                                onClick={() =>
                                    openModal(TYPE_MODAL_YOUTUBE_KEYS.CREATE)
                                }
                            />
                        </div>
                    )}
                />

                {(typeModal === TYPE_MODAL_YOUTUBE_KEYS.CREATE ||
                    typeModal === TYPE_MODAL_YOUTUBE_KEYS.UPDATE) && (
                    <YoutubeKeyFormModal />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
