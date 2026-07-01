'use client';

import { Button, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { ReleasesData } from '../../types';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';

interface DspStatusModalProps {
    open: boolean;
    onCancel: () => void;
    record: ReleasesData | null;
}

export default function DspStatusModal({
    open,
    onCancel,
    record,
}: DspStatusModalProps) {
    const messages = useTranslations();
    const { releaseDsp, isLoading } = useGetListReleaseDsp(record?.id ?? '');

    return (
        <Modal
            title={
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {record && `${record.title}`}
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" type="primary" onClick={onCancel}>
                    {messages('common.close')}
                </Button>,
            ]}
            width={'80vw'}
            centered
        >
            <div className="py-2">
                {record && (
                    <DistributionTable
                        dataSource={releaseDsp?.items ?? []}
                        loading={isLoading}
                        size="middle"
                        rowKey={(record) => record.dsp?.id}
                        pagination={{
                            current: 1,
                            pageSize: 999,
                        }}
                        scroll={{
                            x: '70vh',
                            y: '50vh',
                        }}
                        className="overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-800"
                    />
                )}
            </div>
        </Modal>
    );
}
