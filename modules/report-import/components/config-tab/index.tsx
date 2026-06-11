import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import CreateButton from '@/components/ui/button/create-button';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_REPORT_CONFIG } from '../../enums';
import { useDeleteReportConfig } from '../../hooks/use-delete';
import { DeleteVariables } from '@/types/api';
import ReportConfigForm from '../form';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import ReportConfigTable from '../table';
import { ReportConfigData, ReportConfigDataFilter } from '../../types';

type Props = {
    dataFilter: ReportConfigDataFilter;
    reportConfigsData: {
        items: ReportConfigData[];
        metadata: {
            page: number;
            totalItems: number;
        };
    };
    isLoading: boolean;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePage: (page: number, pageSize: number) => void;
};

export default function ConfigTab({
    dataFilter,
    reportConfigsData,
    isLoading,
    onSearch,
    onChangePage,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const openModal = useModalStore((state) => state.openModal);
    const dataEdit = useModalStore<ReportConfigData>((state) => state.dataEdit);
    const { deleteReportConfig } = useDeleteReportConfig();

    const handleDelete = () => {
        const variables: DeleteVariables<ReportConfigData['id']> = {
            id: dataEdit?.id,
            onSuccess: closeModal,
        };

        deleteReportConfig(variables);
    };

    return (
        <>
            <ReportConfigTable
                title={() => (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ maxWidth: 260 }}
                        />
                        <CreateButton
                            canCreate
                            onClick={() =>
                                openModal(TYPE_MODAL_REPORT_CONFIG.CREATE)
                            }
                        />
                    </div>
                )}
                sticky
                dataFilter={dataFilter}
                dataSource={reportConfigsData.items}
                loading={isLoading}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: reportConfigsData.metadata.page,
                }}
                scroll={{ x: 1800 }}
                onChange={() => undefined}
            />
            <AppPagination
                style={{ backgroundColor: token.colorBgContainer }}
                align="end"
                current={reportConfigsData.metadata.page}
                pageSize={dataFilter.pageSize}
                total={reportConfigsData.metadata.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {(typeModal === TYPE_MODAL_REPORT_CONFIG.CREATE ||
                typeModal === TYPE_MODAL_REPORT_CONFIG.UPDATE) && (
                <ReportConfigForm />
            )}

            {typeModal === TYPE_MODAL_REPORT_CONFIG.DELETE && (
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
        </>
    );
}

