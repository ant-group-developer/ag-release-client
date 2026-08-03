import AppTable from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { Button, Modal, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FtpReportSampleFile } from '../../types';

interface SampleFilesModalProps {
    open: boolean;
    onCancel: () => void;
    files: FtpReportSampleFile[];
}

export const SampleFilesModal = ({
    open,
    onCancel,
    files = [],
}: SampleFilesModalProps) => {
    const messages = useTranslations();

    const columns: ColumnType<FtpReportSampleFile>[] = [
        {
            title: messages('common.sampleFileName'),
            key: 'fileName',
            dataIndex: 'fileName',
            ellipsis: true,
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
        },
        {
            title: messages('common.download'),
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    icon={<Download size={SIZE_ICON} />}
                    href={record.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {messages('common.download')}
                </Button>
            ),
        },
    ];

    return (
        <Modal
            title={messages('dspReport.ftpParserDetail.sampleFileList')}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={'50vw'}
            styles={{
                body: {
                    maxHeight: '70vh',
                    overflowY: 'auto',
                },
            }}
            centered
        >
            <div className="mt-4 overflow-hidden rounded-lg border">
                <AppTable<FtpReportSampleFile>
                    columns={columns}
                    dataSource={files}
                    rowKey="key"
                    pagination={false}
                    size="small"
                    scroll={{
                        x: 'max-content',
                    }}
                />
            </div>
        </Modal>
    );
};

export default SampleFilesModal;
