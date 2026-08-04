import { Descriptions, Modal, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useGetParserCatalogDetail } from '../../hooks/use-get-parser-catalog-detail';
import { FtpParser } from '../../types';
import { FieldMappingsTable } from './field-mappings-table';

interface FtpParserDetailModalProps {
    open: boolean;
    onCancel: () => void;
    parserCode?: string;
    parser?: FtpParser;
    dspReportId?: string;
}

export const FtpParserDetailModal = ({
    open,
    onCancel,
    parserCode,
    parser,
    dspReportId = '',
}: FtpParserDetailModalProps) => {
    const messages = useTranslations();
    const effectiveParserCode = parserCode || parser?.parserCode || '';
    const { parserDetail, isLoading } = useGetParserCatalogDetail(
        effectiveParserCode,
        open && !!effectiveParserCode
    );

    const activeParser = parserDetail || parser;

    return (
        <Modal
            title={messages('dspReport.ftpParserDetail.title', {
                name:
                    activeParser?.parserName ||
                    activeParser?.parserCode ||
                    effectiveParserCode,
            })}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={'80vw'}
            styles={{
                body: {
                    maxHeight: '80vh',
                },
            }}
            centered
        >
            <Spin spinning={isLoading}>
                {activeParser && (
                    <>
                        <Descriptions
                            bordered
                            size="small"
                            column={2}
                            className="mb-6"
                        >
                            <Descriptions.Item
                                label={messages(
                                    'dspReport.ftpParserDetail.parserCode'
                                )}
                            >
                                {activeParser.parserCode}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={messages(
                                    'dspReport.ftpParserDetail.sourceCategory'
                                )}
                            >
                                {activeParser.sourceCategory}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={messages(
                                    'dspReport.ftpParserDetail.sourceFile'
                                )}
                            >
                                <Typography.Text copyable>
                                    {activeParser.sourceFile}
                                </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={messages(
                                    'dspReport.ftpParserDetail.targetTable'
                                )}
                            >
                                <Typography.Text copyable>
                                    {activeParser.targetTable}
                                </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={messages(
                                    'dspReport.ftpParserDetail.isSelectable'
                                )}
                            >
                                <Typography.Text>
                                    {activeParser.isSelectable
                                        ? messages('common.yes')
                                        : messages('common.no')}
                                </Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={messages(
                                    'dspReport.ftpParserDetail.syncedAt'
                                )}
                            >
                                {activeParser.syncedAt}
                            </Descriptions.Item>
                        </Descriptions>

                        <Typography.Title level={5} className="mb-2 mt-6">
                            {messages(
                                'dspReport.ftpParserDetail.fieldMappings'
                            )}
                        </Typography.Title>
                        <FieldMappingsTable
                            parserCode={activeParser.parserCode}
                            fieldMappings={activeParser.fieldMappings || []}
                            dspReportId={dspReportId}
                        />
                    </>
                )}
            </Spin>
        </Modal>
    );
};
