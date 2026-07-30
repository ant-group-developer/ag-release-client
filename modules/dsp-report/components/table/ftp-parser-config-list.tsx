import AppTable from '@/components/ui/table/normal-table';
import { Button, Tag, theme, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FtpParser } from '../../types';
import { FtpParserDetailModal } from './ftp-parser-detail-modal';

export interface FtpParserConfigItem {
    id: string;
    fileName: string;
    folder: string;
    source: string;
    actionStatus: 'import' | 'ignore' | 'pending';
    actionStatusLabel: string;
    parser?: FtpParser;
}

export const FAKE_FTP_PARSER_CONFIG_DATA: FtpParserConfigItem[] = [
    {
        id: '1',
        fileName:
            'bombshelter-digital-services-llc_vevo_merlin_user_interactions_[abcregex]',
        folder: '/trends/vvo-vevo',
        source: 'ftp_merlin',
        actionStatus: 'import',
        actionStatusLabel: 'Lấy vào báo cáo',
        parser: {
            parserCode: 'VEVO_USER_INTERACTIONS',
            sourceCategory: 'vvo-vevo',
            parserName: 'Vevo User Interactions Parser',
            sourceFile:
                'bombshelter-digital-services-llc_vevo_merlin_user_interactions_[abcregex]',
            targetTable: 'dsp_report_vevo_user_interactions',
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
            sourceHash: 'abc123hash',
            isSelectable: true,
            syncedAt: '2026-07-30 12:00:00',
        },
    },
    {
        id: '2',
        fileName:
            'bombshelter-digital-services-llc_vevo_merlin_user_attributes_',
        folder: '/trends/vvo-vevo',
        source: 'ftp_merlin',
        actionStatus: 'ignore',
        actionStatusLabel: 'Bỏ qua',
        parser: {
            parserCode: 'VEVO_USER_ATTRIBUTES',
            sourceCategory: 'vvo-vevo',
            parserName: 'Vevo User Attributes Parser',
            sourceFile:
                'bombshelter-digital-services-llc_vevo_merlin_user_attributes_',
            targetTable: 'dsp_report_vevo_user_attributes',
            fieldMappings: [
                {
                    reportColumn: 'user_id',
                    parserColumn: 'user_id',
                    targetColumn: 'user_id',
                    transform: 'TRIM(user_id)',
                },
                {
                    reportColumn: 'age_group',
                    parserColumn: 'age_group',
                    targetColumn: 'age_range',
                    transform: 'DEFAULT_AGE(age_group)',
                },
                {
                    reportColumn: 'subscription_status',
                    parserColumn: 'subscription_status',
                    targetColumn: 'is_premium',
                    transform:
                        'CASE WHEN subscription_status = "active" THEN true ELSE false END',
                },
            ],
            sourceHash: 'def456hash',
            isSelectable: false,
            syncedAt: '2026-07-30 12:00:00',
        },
    },
    {
        id: '3',
        fileName: 'bombshelter-digital-services-llc_vevo_merlin_devices_',
        folder: '/trends/vvo-vevo',
        source: 'ftp_merlin',
        actionStatus: 'pending',
        actionStatusLabel: 'Chờ admin xác nhận',
        parser: {
            parserCode: 'VEVO_DEVICES',
            sourceCategory: 'vvo-vevo',
            parserName: 'Vevo Devices Parser',
            sourceFile: 'bombshelter-digital-services-llc_vevo_merlin_devices_',
            targetTable: 'dsp_report_vevo_devices',
            fieldMappings: [
                {
                    reportColumn: 'device_id',
                    parserColumn: 'device_id',
                    targetColumn: 'device_id',
                    transform: 'TRIM(device_id)',
                },
                {
                    reportColumn: 'os_version',
                    parserColumn: 'os_version',
                    targetColumn: 'platform_version',
                    transform: 'LOWER(os_version)',
                },
                {
                    reportColumn: 'model_name',
                    parserColumn: 'model_name',
                    targetColumn: 'device_model',
                    transform: 'COALESCE(model_name, "Generic")',
                },
            ],
            sourceHash: 'ghi789hash',
            isSelectable: false,
            syncedAt: '2026-07-30 12:00:00',
        },
    },
];

interface FtpParserConfigListProps {
    dspReportId?: string;
    data?: FtpParserConfigItem[];
}

// Sub-component rendering status tag according to component breakdown rule
const ActionStatusTag = ({
    status,
    label,
}: {
    status: FtpParserConfigItem['actionStatus'];
    label: string;
}) => {
    const colorMap: Record<FtpParserConfigItem['actionStatus'], string> = {
        import: 'success',
        ignore: 'default',
        pending: 'processing',
    };

    return <Tag color={colorMap[status] || 'default'}>{label}</Tag>;
};

export const FtpParserConfigList = ({
    dspReportId,
    data = FAKE_FTP_PARSER_CONFIG_DATA,
}: FtpParserConfigListProps) => {
    const messages = useTranslations();
    const [activeParser, setActiveParser] = useState<FtpParser | undefined>(
        undefined
    );
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const { token } = theme.useToken();

    const handleViewConfig = (record: FtpParserConfigItem) => {
        if (record.parser) {
            setActiveParser(record.parser);
            setIsDetailModalOpen(true);
        }
    };

    const columns: ColumnType<FtpParserConfigItem>[] = [
        {
            title: messages('common.fileName'),
            key: 'fileName',
            dataIndex: 'fileName',
            width: 380,
            ellipsis: true,
            render: (value: string) => (
                <Typography.Text copyable strong className="font-mono">
                    {value}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.folder'),
            key: 'folder',
            dataIndex: 'folder',
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
            title: messages('common.action'),
            key: 'actionStatus',
            width: 180,
            render: (_, record) => (
                <ActionStatusTag
                    status={record.actionStatus}
                    label={record.actionStatusLabel}
                />
            ),
        },
        {
            title: messages('common.action'),
            key: 'action',
            width: 140,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    onClick={() => handleViewConfig(record)}
                >
                    {messages('common.viewConfig')}
                </Button>
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
            <AppTable<FtpParserConfigItem>
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={false}
            />
            {isDetailModalOpen && activeParser && (
                <FtpParserDetailModal
                    open={isDetailModalOpen}
                    onCancel={() => {
                        setIsDetailModalOpen(false);
                        setActiveParser(undefined);
                    }}
                    parser={activeParser}
                    dspReportId={dspReportId || ''}
                />
            )}
        </div>
    );
};

export default FtpParserConfigList;
