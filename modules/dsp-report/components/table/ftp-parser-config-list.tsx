import AppTable from '@/components/ui/table/normal-table';
import { Button, Select, Tag, theme, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FTP_REPORT_FILE_RULE_STATUS } from '../../enums';
import { useGetListFtpReportFileRules } from '../../hooks/use-get-list-ftp-report-file-rules';
import { useUpdateFtpReportFileRule } from '../../hooks/use-update-ftp-report-file-rule';
import { FtpReportFileRule, FtpReportSampleFile } from '../../types';
import { SampleFilesModal } from '../modal/sample-files-modal';
import { FtpParserDetailModal } from './ftp-parser-detail-modal';

interface FtpParserConfigListProps {
    dspReportId?: string;
    sourceCategory?: string;
    dspName?: string;
}

// Sub-component rendering status select according to component breakdown rule
const ActionStatusSelect = ({
    status,
    onChange,
    disabled,
}: {
    status: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) => {
    const messages = useTranslations();

    const options = [
        {
            value: FTP_REPORT_FILE_RULE_STATUS.IMPORT,
            label: messages('dspReport.ruleStatus.import'),
        },
        {
            value: FTP_REPORT_FILE_RULE_STATUS.IGNORE,
            label: messages('dspReport.ruleStatus.ignore'),
        },
        {
            value: FTP_REPORT_FILE_RULE_STATUS.PENDING,
            label: messages('dspReport.ruleStatus.pending'),
        },
    ];

    return (
        <Select
            value={status}
            onChange={onChange}
            options={options}
            disabled={disabled}
            className="!w-full"
        />
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
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { token } = theme.useToken();

    const { ftpReportFileRulesData, isLoading } = useGetListFtpReportFileRules({
        sourceCategory,
        dspFolder: dspName,
    });

    const { updateFtpReportFileRule, isUpdating } =
        useUpdateFtpReportFileRule();

    const handleChange = (id: string, payload: Partial<FtpReportFileRule>) => {
        setUpdatingId(id);
        updateFtpReportFileRule({
            id,
            payload,
            onSuccess: () => {
                setUpdatingId(null);
            },
            onError: () => {
                setUpdatingId(null);
            },
        });
    };

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
            width: 200,
            render: (status: string, record: FtpReportFileRule) => (
                <ActionStatusSelect
                    status={status}
                    disabled={isUpdating && updatingId === record.id}
                    onChange={(newStatus) =>
                        handleChange(record.id, {
                            status: newStatus,
                        })
                    }
                />
            ),
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
