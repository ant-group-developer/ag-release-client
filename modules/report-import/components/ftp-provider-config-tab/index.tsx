'use client';

import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { DeleteVariables } from '@/types/api';
import { Card, Space, Typography, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TYPE_MODAL_FTP_PROVIDER_CONFIG } from '../../enums';
import { useDeleteFtpProviderConfig } from '../../hooks/use-delete';
import { useGetListFtpProviderConfig } from '../../hooks/use-get-list';
import { FtpProviderConfigData } from '../../types';
import FtpProviderConfigTableFilter, {
    FtpProviderConfigFilterState,
} from './filter';
import FtpProviderConfigForm from './form';
import FtpProviderConfigTable from './table';

export default function FtpProviderConfigTab() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore<FtpProviderConfigData>(
        (state) => state.dataEdit
    );
    const { deleteFtpProviderConfig } = useDeleteFtpProviderConfig();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [isActiveFilter, setIsActiveFilter] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedKeyword(keyword);
            setPage(1);
        }, 400);

        return () => clearTimeout(handler);
    }, [keyword]);

    const { ftpProviderConfigsData, isFetching } = useGetListFtpProviderConfig({
        page,
        pageSize,
        keyword: debouncedKeyword || undefined,
        isActive:
            isActiveFilter !== undefined
                ? isActiveFilter === 'true'
                : undefined,
    });

    const onChangePage = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

    const handleDelete = () => {
        const variables: DeleteVariables<FtpProviderConfigData['id']> = {
            id: dataEdit?.id,
            onSuccess: closeModal,
        };

        deleteFtpProviderConfig(variables);
    };

    const handleFilterChange = (
        newFilter: Partial<FtpProviderConfigFilterState>
    ) => {
        if ('keyword' in newFilter) {
            setKeyword(newFilter.keyword ?? '');
        }
        if ('isActive' in newFilter) {
            setIsActiveFilter(newFilter.isActive);
            setPage(1);
        }
    };

    return (
        <Card
            title={
                <Space size={8}>
                    <Typography.Text strong className="text-lg">
                        {messages('reportConfigs.ftpProviderConfig.label')}
                    </Typography.Text>
                </Space>
            }
        >
            <FtpProviderConfigTable
                title={() => (
                    <div className="flex w-full flex-wrap items-center justify-between gap-3">
                        <FtpProviderConfigTableFilter
                            filter={{
                                keyword,
                                isActive: isActiveFilter,
                            }}
                            onChangeFilter={handleFilterChange}
                        />
                        <CreateButton
                            canCreate
                            onClick={() =>
                                openModal(
                                    TYPE_MODAL_FTP_PROVIDER_CONFIG.CREATE
                                )
                            }
                        />
                    </div>
                )}
                sticky
                dataFilter={{
                    page,
                    pageSize,
                    keyword: debouncedKeyword,
                    isActive: isActiveFilter,
                }}
                dataSource={ftpProviderConfigsData.items}
                loading={isFetching}
                pagination={{
                    pageSize,
                    current: ftpProviderConfigsData.metadata.page,
                }}
                onChange={() => undefined}
            />

            <AppPagination
                style={{
                    backgroundColor: token.colorBgContainer,
                    marginTop: 16,
                }}
                align="end"
                current={ftpProviderConfigsData.metadata.page}
                pageSize={pageSize}
                total={ftpProviderConfigsData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_FTP_PROVIDER_CONFIG.CREATE ||
                typeModal === TYPE_MODAL_FTP_PROVIDER_CONFIG.UPDATE) && (
                <FtpProviderConfigForm />
            )}

            {typeModal === TYPE_MODAL_FTP_PROVIDER_CONFIG.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={handleDelete}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.name || dataEdit?.code || dataEdit?.id,
                    })}
                />
            )}
        </Card>
    );
}
