'use client';

import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { ReleasesData } from '../../types';

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

    return (
        <Modal
            title={
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {record && `${record.title}`}
                </div>
            }
            open={open}
            onCancel={onCancel}
            width={'80vw'}
            centered
            footer={null}
        >
            <div className="py-2">
                {record && (
                    <DistributionTable
                        dataSource={record?.releaseDspDeliveries ?? []}
                        size="middle"
                        rowKey={(record) => record.dsp?.id}
                        pagination={{
                            current: 1,
                            pageSize: 999,
                        }}
                        scroll={{
                            x: '70vw',
                            y: '60vh',
                        }}
                        className="overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-800"
                        options={false}
                    />
                )}
            </div>
        </Modal>
    );
}
