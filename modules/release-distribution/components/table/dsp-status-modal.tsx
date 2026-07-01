import { Button, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { ReleaseCiData } from '../../types';
import ExportTable from './export-table';

interface DspStatusModalProps {
    open: boolean;
    onCancel: () => void;
    record: ReleaseCiData | null;
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
                    {record && `${record.release?.title}`}
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
                    <ExportTable
                        dataSource={record?.exportRawData?._embedded ?? []}
                        size="middle"
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
