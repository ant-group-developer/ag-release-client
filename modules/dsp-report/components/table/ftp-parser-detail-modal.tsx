import AppTable from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { Button, Descriptions, Modal, Tag, Typography, message } from 'antd';
import { ColumnType } from 'antd/es/table';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FtpParser } from '../../types';
import { FieldMappingsTable } from './field-mappings-table';

export interface SampleFileItem {
    id: string;
    fileName: string;
    fileSize: string;
    createdAt: string;
    downloadUrl?: string;
}

export const FAKE_SAMPLE_FILES: SampleFileItem[] = [
    {
        id: '1',
        fileName:
            'bombshelter-digital-services-llc_vevo_merlin_user_interactions_20260701.csv',
        fileSize: '2.4 MB',
        createdAt: '2026-07-01 10:30',
    },
    {
        id: '2',
        fileName:
            'bombshelter-digital-services-llc_vevo_merlin_user_interactions_20260715.csv',
        fileSize: '3.1 MB',
        createdAt: '2026-07-15 14:15',
    },
    {
        id: '3',
        fileName:
            'bombshelter-digital-services-llc_vevo_merlin_user_interactions_sample_v1.tsv',
        fileSize: '512 KB',
        createdAt: '2026-07-20 09:00',
    },
    {
        id: '4',
        fileName:
            'bombshelter-digital-services-llc_vevo_merlin_user_interactions_template.xlsx',
        fileSize: '1.2 MB',
        createdAt: '2026-07-25 16:45',
    },
];

const SampleFilesTable = ({
    files = FAKE_SAMPLE_FILES,
}: {
    files?: SampleFileItem[];
}) => {
    const messages = useTranslations();

    const handleDownload = (file: SampleFileItem) => {
        message.success(
            messages('common.downloading', { name: file.fileName })
        );
    };

    const columns: ColumnType<SampleFileItem>[] = [
        {
            title: messages('common.iNo'),
            key: 'stt',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('common.sampleFileName'),
            key: 'fileName',
            dataIndex: 'fileName',
            width: 380,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text copyable strong className="font-mono">
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.size'),
            key: 'fileSize',
            dataIndex: 'fileSize',
            width: 120,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            width: 160,
            render: (text: string) => (
                <Typography.Text type="secondary">{text}</Typography.Text>
            ),
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
                    onClick={() => handleDownload(record)}
                >
                    {messages('common.download')}
                </Button>
            ),
        },
    ];

    return (
        <div className="mt-4 overflow-hidden rounded-lg border">
            <AppTable<SampleFileItem>
                columns={columns}
                dataSource={files}
                rowKey="id"
                pagination={false}
                size="small"
            />
        </div>
    );
};

export const DEFAULT_FAKE_PARSER: FtpParser = {
    parserCode: 'VEVO_USER_INTERACTIONS',
    sourceCategory: 'vvo-vevo',
    parserName: 'Vevo User Interactions Parser',
    sourceFile:
        'bombshelter-digital-services-llc_vevo_merlin_user_interactions_[abcregex]',
    targetTable: 'dsp_report_vevo_user_interactions',
    isSelectable: true,
    syncedAt: '2026-07-30 12:00:00',
    sourceHash: 'abc123hash',
    fieldMappings: [
        {
            reportColumn: 'user_id',
            parserColumn: 'user_id',
            targetColumn: 'user_id',
            transform: 'TRIM(LOWER(user_id))',
        },
        {
            reportColumn: 'interaction_type',
            parserColumn: 'interaction_type',
            targetColumn: 'action_type',
            transform: 'COALESCE(interaction_type, "unknown")',
        },
        {
            reportColumn: 'event_timestamp',
            parserColumn: 'event_timestamp',
            targetColumn: 'created_at',
            transform: 'TO_TIMESTAMP(event_timestamp)',
        },
        {
            reportColumn: 'country_code',
            parserColumn: 'country_code',
            targetColumn: 'country',
            transform: 'UPPER(country_code)',
        },
    ],
};

interface FtpParserDetailModalProps {
    open: boolean;
    onCancel: () => void;
    parser?: FtpParser;
    dspReportId: string;
}

export const FtpParserDetailModal = ({
    open,
    onCancel,
    parser = DEFAULT_FAKE_PARSER,
    dspReportId,
}: FtpParserDetailModalProps) => {
    const messages = useTranslations();
    const activeParser = parser || DEFAULT_FAKE_PARSER;

    return (
        <Modal
            title={messages('dspReport.ftpParserDetail.title', {
                name: activeParser.parserName,
            })}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={'80vw'}
            styles={{
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
            }}
            centered
        >
            <Descriptions bordered size="small" column={2} className="mb-6">
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.parserCode')}
                >
                    {activeParser.parserCode}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.sourceCategory')}
                >
                    {activeParser.sourceCategory}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.sourceFile')}
                >
                    <Typography.Text copyable>
                        {activeParser.sourceFile}
                    </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.targetTable')}
                >
                    <Typography.Text copyable>
                        {activeParser.targetTable}
                    </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.isSelectable')}
                >
                    <Typography.Text>
                        {activeParser.isSelectable
                            ? messages('common.yes')
                            : messages('common.no')}
                    </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.syncedAt')}
                >
                    {activeParser.syncedAt}
                </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5} className="mb-2 mt-6">
                {messages('dspReport.ftpParserDetail.fieldMappings')}
            </Typography.Title>
            <FieldMappingsTable
                parserCode={activeParser.parserCode}
                fieldMappings={activeParser.fieldMappings || []}
                dspReportId={dspReportId}
            />

            <Typography.Title level={5} className="mb-2 mt-6">
                {messages('dspReport.ftpParserDetail.sampleFileList')}
            </Typography.Title>
            <SampleFilesTable />
        </Modal>
    );
};
