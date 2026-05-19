import AppModal from '@/components/ui/modal/normal-modal';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useMemo, useState } from 'react';
import { TYPE_MODAL_DISTRIBUTION_JOB } from '../../constants/modal';
import { useAutoSendEmailDistributionJobs } from '../../hooks/use-auto-send-email';
import { useConfirmCompletedDistributionJobs } from '../../hooks/use-confirm-completed';
import { useDownloadExcelDistributionJobs } from '../../hooks/use-download-excel';
import {
    DISTRIBUTION_JOB_STATUS,
    DISTRIBUTION_JOB_TYPE,
    DistributionJobData,
    DistributionJobGroupedData,
} from '../../types';
import DistributionJobsTable from '../table';
import DistributionJobsTableAlertAction from '../table-alert-action';

interface Props {
    groupedData?: DistributionJobGroupedData[];
}

export default function DistributionJobDetailModal({ groupedData }: Props) {
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<DistributionJobGroupedData>(
        (state) => state.dataEdit
    );
    const closeModal = useModalStore((state) => state.closeModal);

    const open = typeModal === TYPE_MODAL_DISTRIBUTION_JOB.DETAIL;

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<DistributionJobData[]>([]);

    const [filterType, setFilterType] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const activeData = useMemo(() => {
        if (!dataEdit) return [];
        if (!groupedData) return dataEdit.data || [];

        const currentGroup = groupedData.find(
            (item) =>
                item.dateGroup === dataEdit.dateGroup &&
                item.type === dataEdit.type &&
                item.deliveryEmailSubject === dataEdit.deliveryEmailSubject
        );

        return currentGroup ? currentGroup.data : dataEdit.data || [];
    }, [dataEdit, groupedData]);

    const filteredData = useMemo(() => {
        return activeData.filter((item) => {
            if (filterType && item.type !== filterType) return false;
            if (filterStatus && item.status !== filterStatus) return false;
            return true;
        });
    }, [activeData, filterType, filterStatus]);

    const typeOptions = Object.values(DISTRIBUTION_JOB_TYPE).map((type) => ({
        label: messages(
            `distributionJobs.typeOptions.${type.toUpperCase()}` as any
        ),
        value: type,
    }));

    const statusOptions = Object.values(DISTRIBUTION_JOB_STATUS).map(
        (status) => ({
            label: messages(`distributionJobs.statusOptions.${status}` as any),
            value: status,
        })
    );

    const { autoSendEmail, isPending: isAutoSendingEmail } =
        useAutoSendEmailDistributionJobs();
    const { downloadExcel, isPending: isDownloadingExcel } =
        useDownloadExcelDistributionJobs();
    const { confirmCompleted, isPending: isConfirmingCompleted } =
        useConfirmCompletedDistributionJobs();

    const onAutoSendEmail = () => {
        const filteredIds = selectedRows
            .filter((row) => row.type === DISTRIBUTION_JOB_TYPE.EMAIL_STATE51)
            .map((row) => row.id);

        if (filteredIds.length === 0) return;

        autoSendEmail({
            ids: filteredIds,
            onSuccess: () => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
            },
        });
    };

    const onDownloadExcel = () => {
        const filteredIds = selectedRows
            .filter((row) => row.type === DISTRIBUTION_JOB_TYPE.ADMIN_EXPORT)
            .map((row) => row.id);

        if (filteredIds.length === 0)
            return showNotification(
                'info',
                messages('distributionJobs.error.mustHaveAdminExport')
            );

        downloadExcel({
            ids: filteredIds,
            onSuccess: () => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
            },
        });
    };

    const onConfirmCompleted = () => {
        confirmCompleted({
            ids: selectedRowKeys,
            exportIdFromCi: '',
            onSuccess: () => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
            },
        });
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: Key[], rows: DistributionJobData[]) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
        },
        getCheckboxProps: (record: DistributionJobData) => ({
            disabled:
                record.status === DISTRIBUTION_JOB_STATUS.COMPLETED ||
                record.status === DISTRIBUTION_JOB_STATUS.SKIPPED,
        }),
    };

    // Reset selection when modal closes
    useEffect(() => {
        if (!open) {
            setSelectedRowKeys([]);
            setSelectedRows([]);
            setFilterType(null);
            setFilterStatus(null);
        }
    }, [open]);

    return (
        <AppModal
            open={open}
            onCancel={closeModal}
            title={messages('distributionJobs.detail')}
            width="100%"
            style={{
                maxWidth: '90vw',
                top: 16,
            }}
            footer={null}
        >
            <DistributionJobsTable
                sticky
                dataSource={filteredData}
                pagination={{
                    pageSize: 8,
                }}
                headerTitle={
                    <Space>
                        <Select
                            allowClear
                            placeholder={messages(
                                'distributionJobs.columns.type'
                            )}
                            style={{ width: 200 }}
                            options={typeOptions}
                            value={filterType}
                            onChange={setFilterType}
                        />
                        <Select
                            allowClear
                            placeholder={messages(
                                'distributionJobs.columns.status'
                            )}
                            style={{ width: 200 }}
                            options={statusOptions}
                            value={filterStatus}
                            onChange={setFilterStatus}
                        />
                    </Space>
                }
                // scroll={{
                //     y: 'calc(100vh - 350px)',
                // }}
                rowSelection={rowSelection}
                tableAlertOptionRender={() => (
                    <DistributionJobsTableAlertAction
                        isAutoSendingEmail={isAutoSendingEmail}
                        onAutoSendEmail={onAutoSendEmail}
                        isDownloadingExcel={isDownloadingExcel}
                        onDownloadExcel={onDownloadExcel}
                        isConfirmingCompleted={isConfirmingCompleted}
                        onConfirmCompleted={onConfirmCompleted}
                    />
                )}
                options={{
                    reload: false,
                    setting: false,
                    density: false,
                }}
            />
        </AppModal>
    );
}
