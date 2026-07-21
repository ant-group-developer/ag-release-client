import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import {
    Badge,
    Card,
    Col,
    Row,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import { Eye, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetFtpParserConfigs } from '../../hooks/use-get-ftp-parser-configs';
import { FtpParser } from '../../types';
import { FtpParserConfigModal } from './ftp-parser-config-modal';
import { FtpParserDetailModal } from './ftp-parser-detail-modal';

interface FtpParserConfigListProps {
    dspReportId: string;
}

export const FtpParserConfigList = ({
    dspReportId,
}: FtpParserConfigListProps) => {
    const messages = useTranslations();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeParser, setActiveParser] = useState<FtpParser | undefined>(
        undefined
    );
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const { ftpParserConfigs, isLoading } = useGetFtpParserConfigs(dspReportId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-6">
                <Spin size="small" />
            </div>
        );
    }

    if (!ftpParserConfigs || ftpParserConfigs.length === 0) {
        return (
            <div className="py-4 text-center">
                <Typography.Text type="secondary">
                    {messages('dspReport.ftpParserConfig.noData')}
                </Typography.Text>
            </div>
        );
    }

    return (
        <Row
            gutter={[16, 16]}
            className="rounded-lg bg-gray-50/50 p-4 dark:bg-zinc-900/50"
        >
            {ftpParserConfigs.map((config) => (
                <Col key={config.parserCode} xs={24} sm={12} md={8} lg={6}>
                    <Card
                        title={
                            <Space>
                                <Typography.Text
                                    strong
                                    ellipsis
                                    className="max-w-full"
                                >
                                    {config.parserCode}
                                </Typography.Text>
                                <Badge
                                    status={
                                        config.isActive ? 'success' : 'default'
                                    }
                                />
                            </Space>
                        }
                        size="small"
                        extra={
                            <div>
                                <Tooltip title={messages('common.viewDetail')}>
                                    <IconButton
                                        onClick={() => {
                                            setActiveParser(config.parser);
                                            setIsDetailModalOpen(true);
                                        }}
                                    >
                                        <Eye size={SIZE_ICON} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={messages('common.edit')}>
                                    <IconButton
                                        onClick={() => {
                                            setActiveCategory(
                                                config.sourceCategory
                                            );
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <Pencil size={SIZE_ICON} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        }
                        className="shadow-sm"
                    >
                        <Space direction="vertical" className="w-full">
                            <div>
                                <Typography.Text
                                    type="secondary"
                                    className="mr-1"
                                >
                                    {messages(
                                        'dspReport.ftpParserConfig.sourceCategory'
                                    )}
                                    :
                                </Typography.Text>
                                <Typography.Text>
                                    {config.sourceCategory}
                                </Typography.Text>
                            </div>
                            <div>
                                <Typography.Text
                                    type="secondary"
                                    className="mr-1"
                                >
                                    {messages(
                                        'dspReport.ftpParserConfig.description'
                                    )}
                                    :
                                </Typography.Text>
                                <Typography.Text>
                                    {config.description || '-'}
                                </Typography.Text>
                            </div>
                            {config.includePatterns &&
                                config.includePatterns.length > 0 && (
                                    <div>
                                        <Typography.Text
                                            type="secondary"
                                            className="mb-1 block"
                                        >
                                            {messages(
                                                'dspReport.ftpParserConfig.includePatterns'
                                            )}
                                            :
                                        </Typography.Text>
                                        <div className="flex flex-wrap gap-1">
                                            {config.includePatterns.map(
                                                (pat) => (
                                                    <Tag
                                                        key={pat}
                                                        className="m-0"
                                                    >
                                                        {pat}
                                                    </Tag>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            {config.excludePatterns &&
                                config.excludePatterns.length > 0 && (
                                    <div>
                                        <Typography.Text
                                            type="secondary"
                                            className="mb-1 block"
                                        >
                                            {messages(
                                                'dspReport.ftpParserConfig.excludePatterns'
                                            )}
                                            :
                                        </Typography.Text>
                                        <div className="flex flex-wrap gap-1">
                                            {config.excludePatterns.map(
                                                (pat) => (
                                                    <Tag
                                                        key={pat}
                                                        className="m-0"
                                                    >
                                                        {pat}
                                                    </Tag>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </Space>
                    </Card>
                </Col>
            ))}
            {isModalOpen && activeCategory && (
                <FtpParserConfigModal
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setActiveCategory(null);
                    }}
                    dspReportId={dspReportId}
                    category={activeCategory}
                />
            )}
            {isDetailModalOpen && activeParser && (
                <FtpParserDetailModal
                    open={isDetailModalOpen}
                    onCancel={() => {
                        setIsDetailModalOpen(false);
                        setActiveParser(undefined);
                    }}
                    parser={activeParser}
                    dspReportId={dspReportId}
                />
            )}
        </Row>
    );
};
