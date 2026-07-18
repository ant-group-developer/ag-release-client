import {
    CheckOutlined,
    FileExcelOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { Button, Space, theme } from 'antd';
import { useTranslations } from 'next-intl';

interface DistributionJobsTableAlertActionProps {
    isAutoSendingEmail: boolean;
    onAutoSendEmail: () => void;
    isDownloadingExcel: boolean;
    onDownloadExcel: () => void;
    isConfirmingCompleted: boolean;
    onConfirmCompleted: () => void;
    showAutoSendEmail?: boolean;
    showDownloadExcel?: boolean;
}

const DistributionJobsTableAlertAction = ({
    isAutoSendingEmail,
    onAutoSendEmail,
    isDownloadingExcel,
    onDownloadExcel,
    isConfirmingCompleted,
    onConfirmCompleted,
    showAutoSendEmail = true,
    showDownloadExcel = true,
}: DistributionJobsTableAlertActionProps) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <Space size={16}>
            {showAutoSendEmail && (
                <Button
                    type="text"
                    icon={<MailOutlined />}
                    loading={isAutoSendingEmail}
                    onClick={onAutoSendEmail}
                    style={{ color: token.colorPrimary }}
                >
                    {messages('distributionJobs.autoSendEmail')}
                </Button>
            )}
            {showDownloadExcel && (
                <Button
                    type="text"
                    icon={<FileExcelOutlined />}
                    loading={isDownloadingExcel}
                    onClick={onDownloadExcel}
                    style={{ color: token.colorPrimary }}
                >
                    {messages('distributionJobs.downloadExcel')}
                </Button>
            )}
            <Button
                type="text"
                icon={<CheckOutlined />}
                loading={isConfirmingCompleted}
                onClick={onConfirmCompleted}
                style={{ color: token.colorPrimary }}
            >
                {messages('distributionJobs.confirmCompleted')}
            </Button>
        </Space>
    );
};

export default DistributionJobsTableAlertAction;
