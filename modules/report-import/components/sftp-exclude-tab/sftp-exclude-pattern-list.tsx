import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { DeleteVariables } from '@/types/api';
import { SyncOutlined } from '@ant-design/icons';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
    FTP_EXCLUDE_PATTERN_SCOPE,
    PATTERN_TYPE,
    TYPE_MODAL_FTP_EXCLUDE_PATTERN,
} from '../../enums';
import { useDeleteFtpExcludePattern } from '../../hooks/use-delete';
import { useGetListFtpExcludePattern } from '../../hooks/use-get-list';
import { FtpExcludePatternData } from '../../types';
import FtpExcludePatternTableFilter, {
    FtpExcludePatternFilterState,
} from './filter';
import FtpExcludePatternForm from './form';
import SyncModal from './sync-modal';
import FtpExcludePatternTable from './table';

export default function SftpExcludePatternList() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore<FtpExcludePatternData>(
        (state) => state.dataEdit
    );
    const { deleteFtpExcludePattern } = useDeleteFtpExcludePattern();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');

    const [scope, setScope] = useState<FTP_EXCLUDE_PATTERN_SCOPE[] | undefined>(
        undefined
    );
    const [patternType, setPatternType] = useState<PATTERN_TYPE | undefined>(
        undefined
    );
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

    const { ftpExcludePatternsData, isFetching } = useGetListFtpExcludePattern({
        page,
        pageSize,
        keyword: debouncedKeyword || undefined,
        scope: scope && scope.length > 0 ? scope.join(',') : undefined,
        patternType,
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
        const variables: DeleteVariables<FtpExcludePatternData['id']> = {
            id: dataEdit?.id,
            onSuccess: closeModal,
        };

        deleteFtpExcludePattern(variables);
    };

    const handleFilterChange = (
        newFilter: Partial<FtpExcludePatternFilterState>
    ) => {
        if ('keyword' in newFilter) {
            setKeyword(newFilter.keyword ?? '');
        }
        if ('scope' in newFilter) {
            setScope(newFilter.scope);
            setPage(1);
        }
        if ('patternType' in newFilter) {
            setPatternType(newFilter.patternType);
            setPage(1);
        }
        if ('isActive' in newFilter) {
            setIsActiveFilter(newFilter.isActive);
            setPage(1);
        }
    };

    return (
        <div
            style={{
                border: `1px solid ${token.colorBorder}`,
                padding: '20px 16px',
                borderRadius: token.borderRadiusLG,
            }}
        >
            <span className="px-2 font-bold">
                {messages('report-import.configExcludePattern')}
            </span>
            <FtpExcludePatternTable
                title={() => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <FtpExcludePatternTableFilter
                            filter={{
                                keyword,
                                scope,
                                patternType,
                                isActive: isActiveFilter,
                            }}
                            onChangeFilter={handleFilterChange}
                        />
                        <div
                            style={{
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                icon={<SyncOutlined />}
                                onClick={() => setIsSyncModalOpen(true)}
                            >
                                {messages('analytics2.syncAll.button')}
                            </Button>
                            <CreateButton
                                canCreate
                                onClick={() =>
                                    openModal(
                                        TYPE_MODAL_FTP_EXCLUDE_PATTERN.CREATE
                                    )
                                }
                            />
                        </div>
                    </div>
                )}
                sticky
                dataFilter={{
                    page,
                    pageSize,
                    keyword: debouncedKeyword,
                    scope: scope && scope.length > 0 ? scope.join(',') : undefined,
                    patternType,
                    isActive: isActiveFilter,
                }}
                dataSource={ftpExcludePatternsData.items}
                loading={isFetching}
                pagination={{
                    pageSize,
                    current: ftpExcludePatternsData.metadata.page,
                }}
                onChange={() => undefined}
            />
            <AppPagination
                style={{
                    backgroundColor: token.colorBgContainer,
                    marginTop: 16,
                }}
                align="end"
                current={ftpExcludePatternsData.metadata.page}
                pageSize={pageSize}
                total={ftpExcludePatternsData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_FTP_EXCLUDE_PATTERN.CREATE ||
                typeModal === TYPE_MODAL_FTP_EXCLUDE_PATTERN.UPDATE) && (
                <FtpExcludePatternForm />
            )}

            {typeModal === TYPE_MODAL_FTP_EXCLUDE_PATTERN.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    onOk={handleDelete}
                    modalTitle={messages('delete.confirmTitle')}
                    paragraph={messages('delete.confirmMessage', {
                        value: dataEdit?.id,
                    })}
                />
            )}
            <SyncModal
                open={isSyncModalOpen}
                onClose={() => setIsSyncModalOpen(false)}
            />
        </div>
    );
}
