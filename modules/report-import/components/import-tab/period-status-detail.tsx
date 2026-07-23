import {
    convertSecondsToHHMMSS,
    formatFileSize,
    formattedNumber,
} from '@/helpers/common';
import { Empty, Table, Tabs, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { EtlJobStatusDetailFile } from '../../types/payload';

interface PeriodStatusDetailProps {
    periodData: Record<string, Record<string, EtlJobStatusDetailFile[]>>;
    selectedType: string;
}

export const PeriodStatusDetail: React.FC<PeriodStatusDetailProps> = ({
    periodData,
    selectedType,
}) => {
    const messages = useTranslations();

    const fileColumns = [
        // {
        //     title: messages('common.fileName'),
        //     dataIndex: 'fileName',
        //     key: 'fileName',
        //     width: 300,
        //     ellipsis: true,
        //     render: (value: string) => (
        //         <Tooltip title={value}>
        //             <Typography.Text ellipsis style={{ maxWidth: 300 }}>
        //                 {value}
        //             </Typography.Text>
        //         </Tooltip>
        //     ),
        // },
        {
            title: messages('common.filePath'),
            dataIndex: 'filePath',
            key: 'filePath',
            width: 300,
            ellipsis: true,
            render: (value: string) => (
                <Tooltip title={value}>
                    <span>{value}</span>
                </Tooltip>
            ),
        },
        {
            title: messages('video.fileSize'),
            dataIndex: 'fileSizeBytes',
            key: 'fileSizeBytes',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formatFileSize(value)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.totalRows'),
            dataIndex: 'totalLines',
            key: 'totalLines',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.processedRows'),
            dataIndex: 'processedRows',
            key: 'processedRows',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.duration'),
            dataIndex: 'durationMs',
            key: 'durationMs',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? convertSecondsToHHMMSS(value / 1000)
                    : '-',
        },
    ];

    const partners = periodData[selectedType] || {};
    const partnerCodes = Object.keys(partners);

    const dspTabItems = partnerCodes.map((partnerCode) => {
        const files = partners[partnerCode] || [];
        return {
            key: partnerCode,
            label: partnerCode.charAt(0).toUpperCase() + partnerCode.slice(1),
            children: (
                <div style={{ marginTop: 12 }}>
                    <Table
                        dataSource={files}
                        columns={fileColumns}
                        rowKey="fileName"
                        pagination={false}
                        size="small"
                        scroll={{ x: '100%', y: '70vh' }}
                        bordered
                    />
                </div>
            ),
        };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dspTabItems.length > 0 ? (
                <Tabs
                    defaultActiveKey={partnerCodes[0]}
                    items={dspTabItems}
                    tabPosition="left"
                />
            ) : (
                <Empty description={messages('common.noDataAvailable')} />
            )}
        </div>
    );
};
