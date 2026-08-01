import AppTable from '@/components/ui/table/normal-table';
import { Button, Tag, theme, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetListFtpReportFileRules } from '../../hooks/use-get-list-ftp-report-file-rules';
import { FtpReportFileRule, FtpReportSampleFile } from '../../types';
import { SampleFilesModal } from '../modal/sample-files-modal';
import { FtpParserDetailModal } from './ftp-parser-detail-modal';

interface FtpParserConfigListProps {
    dspReportId?: string;
    sourceCategory?: string;
    dspName?: string;
}

// Sub-component rendering status tag according to component breakdown rule
const ActionStatusTag = ({ status }: { status: string }) => {
    const messages = useTranslations();
    const colorMap: Record<string, string> = {
        import: 'success',
        ignore: 'default',
        pending: 'processing',
    };

    const labelMap: Record<string, string> = {
        import: messages('dspReport.ruleStatus.import'),
        ignore: messages('dspReport.ruleStatus.ignore'),
        pending: messages('dspReport.ruleStatus.pending'),
    };

    return (
        <Tag color={colorMap[status] || 'default'}>
            {labelMap[status] || status}
        </Tag>
    );
};

export const FtpParserConfigList = ({
    dspReportId,
    sourceCategory,
    dspName,
}: FtpParserConfigListProps) => {
    const messages = useTranslations();
    const [activeParserCode, setActiveParserCode] = useState<string>('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [activeSampleFiles, setActiveSampleFiles] = useState<
        FtpReportSampleFile[]
    >([]);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const { token } = theme.useToken();

    const { ftpReportFileRulesData, isLoading } = useGetListFtpReportFileRules({
        sourceCategory,
        dspFolder: dspName,
    });

    const handleViewConfig = (record: FtpReportFileRule) => {
        setActiveParserCode(record.parserCode || '');
        setIsDetailModalOpen(true);
    };

    const handleViewSampleFiles = (record: FtpReportFileRule) => {
        setActiveSampleFiles(record.sampleFiles || []);
        setIsSampleModalOpen(true);
    };

    const columns: ColumnType<FtpReportFileRule>[] = [
        {
            title: messages('common.fileName'),
            key: 'fileNamePattern',
            dataIndex: 'fileNamePattern',
            width: 380,
            ellipsis: true,
            render: (value: string) => (
                <Typography.Text>{value}</Typography.Text>
            ),
        },
        {
            title: messages('common.folder'),
            key: 'dspFolderPattern',
            dataIndex: 'dspFolderPattern',
            width: 180,
            ellipsis: true,
            render: (value: string) => (
                <Typography.Text type="secondary">{value}</Typography.Text>
            ),
        },
        {
            title: messages('dspReport.table.source'),
            key: 'source',
            dataIndex: 'source',
            width: 130,
            render: (value: string) => <Tag color="blue">{value}</Tag>,
        },
        {
            title: messages('common.category'),
            key: 'sourceCategory',
            dataIndex: 'sourceCategory',
            width: 130,
            render: (value: string) => <Tag color="cyan">{value}</Tag>,
        },
        {
            title: messages('dspReport.ftpParserDetail.parserCode'),
            key: 'parserCode',
            dataIndex: 'parserCode',
            width: 180,
            render: (value: string) => {
                if (!value) return '-';
                return <Typography.Text code>{value}</Typography.Text>;
            },
        },
        {
            title: messages('common.action'),
            key: 'status',
            dataIndex: 'status',
            width: 160,
            render: (status: string) => <ActionStatusTag status={status} />,
        },
        {
            key: 'action',
            width: 260,
            align: 'center',
            render: (_, record) => (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        type="link"
                        size="small"
                        disabled={!record.parserCode}
                        onClick={() => handleViewConfig(record)}
                    >
                        {messages('common.viewConfig')}
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        disabled={
                            !record.sampleFiles ||
                            record.sampleFiles.length === 0
                        }
                        onClick={() => handleViewSampleFiles(record)}
                    >
                        {messages('dspReport.sampleFilesButton', {
                            count: record.sampleFiles?.length || 0,
                        })}
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div
            className="overflow-hidden rounded-lg border"
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <AppTable<FtpReportFileRule>
                virtual
                scroll={{ y: 400 }}
                columns={columns}
                dataSource={ftpReportFileRulesData?.items || []}
                loading={isLoading}
                rowKey="id"
                pagination={false}
            />
            {isDetailModalOpen && (
                <FtpParserDetailModal
                    open={isDetailModalOpen}
                    onCancel={() => {
                        setIsDetailModalOpen(false);
                        setActiveParserCode('');
                    }}
                    parserCode={activeParserCode}
                    dspReportId={dspReportId || ''}
                />
            )}
            {isSampleModalOpen && (
                <SampleFilesModal
                    open={isSampleModalOpen}
                    onCancel={() => {
                        setIsSampleModalOpen(false);
                        setActiveSampleFiles([]);
                    }}
                    files={activeSampleFiles}
                />
            )}
        </div>
    );
};

export default FtpParserConfigList;
