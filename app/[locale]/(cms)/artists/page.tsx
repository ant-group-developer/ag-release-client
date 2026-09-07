'use client';
import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import ArtistFormModal from '@/modules/artist/components/modal/artist-form';
import { ArtistsTable } from '@/modules/artist/components/table';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import { useDeleteArtist } from '@/modules/artist/hooks/use-delete-artist';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { useSyncSpotify } from '@/modules/artist/hooks/use-sync-spotify';
import { useSyncArtistProfileName } from '@/modules/artist/hooks/use-sync-artist-profile-name';
import { ArtistData, ArtistDataFilter } from '@/modules/artist/types';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { DeleteVariables } from '@/types/api';
import { useIsMobile } from '@/hooks/use-is-mobile';
import {
    EllipsisOutlined,
    LoadingOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Dropdown, type MenuProps, theme } from 'antd';
import { useState } from 'react';

import { useTranslations } from 'next-intl';

type Props = {};

export default function Artists({}: Props) {
    // hooks - state
    const openModal = useModalStore((state) => state.openModal);
    const { isAdmin } = usePermission();
    const messages = useTranslations();
    const { token } = theme.useToken();
    const isMobile = useIsMobile();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
        onSearch,
    } = useFilter<ArtistDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
    });
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<ArtistData>((state) => state.dataEdit);

    // api
    const { deleteArtist } = useDeleteArtist();
    const { artistsData, isFetching, lastUpdatedAt, refetch } =
        useGetListArtist(dataFilter);
    const { syncSpotify, isPending: isSyncingSpotify } = useSyncSpotify();
    const {
        syncArtistProfileName,
        isPending: isSyncingArtistProfileName,
    } = useSyncArtistProfileName();
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [isSyncProfileNameModalOpen, setIsSyncProfileNameModalOpen] =
        useState(false);

    // func
    const handleRefresh = () => {
        refetch();
    };
    const handleDeleteArtist = () => {
        const variables: DeleteVariables<ArtistData['id']> = {
            id: dataEdit?.id,
            onSuccess: () => {
                closeModal();
            },
        };
        deleteArtist(variables);
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

    const syncMenuItems: MenuProps['items'] = [
        {
            key: 'sync-spotify',
            label: messages('artist.syncSpotify'),
            icon: isSyncingSpotify ? (
                <LoadingOutlined />
            ) : (
                <SyncOutlined />
            ),
            disabled: isSyncingSpotify,
            onClick: () => setIsSyncModalOpen(true),
        },
        {
            key: 'sync-profile-name',
            label: messages('artist.syncProfileName'),
            icon: isSyncingArtistProfileName ? (
                <LoadingOutlined />
            ) : (
                <SyncOutlined />
            ),
            disabled: isSyncingArtistProfileName,
            onClick: () => setIsSyncProfileNameModalOpen(true),
        },
    ];

    const renderExtra = () => {
        if (isMobile) {
            return (
                <div className="flex items-center gap-2">
                    <PermissionGate permission={PERMISSION.ARTIST.CREATE}>
                        <CreateButton
                            text={messages('artist.create')}
                            onClick={() =>
                                openModal(TYPE_MODAL_ARTIST.CREATE)
                            }
                        />
                    </PermissionGate>
                    {isAdmin && (
                        <Dropdown
                            menu={{ items: syncMenuItems }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Button
                                icon={
                                    isSyncingSpotify ||
                                    isSyncingArtistProfileName ? (
                                        <LoadingOutlined />
                                    ) : (
                                        <EllipsisOutlined />
                                    )
                                }
                            />
                        </Dropdown>
                    )}
                </div>
            );
        }

        return (
            <div className="flex flex-wrap items-center gap-2">
                {isAdmin && (
                    <>
                        <Button
                            type="primary"
                            onClick={() => setIsSyncModalOpen(true)}
                            loading={isSyncingSpotify}
                        >
                            {messages('artist.syncSpotify')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={() =>
                                setIsSyncProfileNameModalOpen(true)
                            }
                            loading={isSyncingArtistProfileName}
                        >
                            {messages('artist.syncProfileName')}
                        </Button>
                    </>
                )}
                <PermissionGate permission={PERMISSION.ARTIST.CREATE}>
                    <CreateButton
                        text={messages('artist.create')}
                        onClick={() => openModal(TYPE_MODAL_ARTIST.CREATE)}
                    />
                </PermissionGate>
            </div>
        );
    };

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('artist.artists')}
                className="[&_.ant-page-header-heading]:flex-wrap [&_.ant-page-header-heading-left]:flex-1"
                extra={renderExtra()}
            >
                {/* <ArtistsHeader dataFilter={dataFilter} onSearch={onSearch} /> */}
                <ArtistsTable
                    sticky
                    dataSource={artistsData?.items}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: artistsData.metadata.page,
                        total: artistsData.metadata.totalItems,
                    }}
                    loading={isFetching}
                    onChange={onChangeSort}
                    dataFilter={dataFilter}
                    headerTitle={
                        <AppSearch
                            className="w-full sm:max-w-52"
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                        />
                    }
                    options={
                        isMobile
                            ? false
                            : {
                                  reload: () => {
                                      handleRefresh();
                                  },
                              }
                    }
                    toolBarRender={isMobile ? () => [] : undefined}
                />

                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
                    current={artistsData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={artistsData?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />

                {(typeModal === TYPE_MODAL_ARTIST.CREATE ||
                    typeModal === TYPE_MODAL_ARTIST.UPDATE) && (
                    <ArtistFormModal
                        open
                        onCancel={closeModal}
                        onCreateSuccess={() => {
                            closeModal();
                        }}
                    />
                )}

                {typeModal === TYPE_MODAL_ARTIST.DELETE && (
                    <AppConfirm
                        open
                        onOk={() => handleDeleteArtist()}
                        onCancel={closeModal}
                        modalTitle={`${messages('artist.delete')} `}
                        paragraph={messages('delete.confirmMessage', {
                            value: dataEdit?.name,
                        })}
                    />
                )}

                {isSyncModalOpen && (
                    <AppConfirm
                        open
                        onOk={() => {
                            syncSpotify({
                                onSuccess: () => {
                                    setIsSyncModalOpen(false);
                                },
                            });
                        }}
                        onCancel={() => setIsSyncModalOpen(false)}
                        modalTitle={messages('artist.syncSpotifyConfirmTitle')}
                        paragraph={messages('artist.syncSpotifyConfirmParagraph')}
                    />
                )}

                {isSyncProfileNameModalOpen && (
                    <AppConfirm
                        open
                        onOk={() => {
                            syncArtistProfileName({
                                onSuccess: () => {
                                    setIsSyncProfileNameModalOpen(false);
                                },
                            });
                        }}
                        onCancel={() => setIsSyncProfileNameModalOpen(false)}
                        modalTitle={messages(
                            'artist.syncProfileNameConfirmTitle'
                        )}
                        paragraph={messages(
                            'artist.syncProfileNameConfirmParagraph'
                        )}
                    />
                )}
            </PageContainer>
        </AppPageWrapper>
    );
}
