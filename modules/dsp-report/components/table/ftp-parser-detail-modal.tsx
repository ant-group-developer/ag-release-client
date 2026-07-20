import { Descriptions, Modal, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { FtpParser } from '../../types';
import { FieldMappingsTable } from './field-mappings-table';

interface FtpParserDetailModalProps {
    open: boolean;
    onCancel: () => void;
    parser?: FtpParser;
    dspReportId: string | number;
}

export const FtpParserDetailModal = ({
    open,
    onCancel,
    parser,
    dspReportId,
}: FtpParserDetailModalProps) => {
    const messages = useTranslations();

    if (!parser) return null;

    return (
        <Modal
            title={messages('dspReport.ftpParserDetail.title', {
                name: parser.parserName,
            })}
            open={open}
            onCancel={onCancel}
            footer={null}
            width={'70vw'}
            styles={{
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                },
            }}
            centered
        >
            <Descriptions bordered size="small" column={2} className="mb-4">
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.parserCode')}
                >
                    {parser.parserCode}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.sourceCategory')}
                >
                    {parser.sourceCategory}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.sourceFile')}
                >
                    <Typography.Text>{parser.sourceFile}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.targetTable')}
                >
                    <Typography.Text>{parser.targetTable}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.isSelectable')}
                >
                    <Typography.Text>
                        {parser.isSelectable
                            ? messages('dspReport.ftpParserDetail.yes')
                            : messages('dspReport.ftpParserDetail.no')}
                    </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('dspReport.ftpParserDetail.syncedAt')}
                >
                    {parser.syncedAt}
                </Descriptions.Item>
            </Descriptions>

            <FieldMappingsTable
                parserCode={parser.parserCode}
                fieldMappings={parser.fieldMappings || []}
                dspReportId={dspReportId}
            />
        </Modal>
    );
};
