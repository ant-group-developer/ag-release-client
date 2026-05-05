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
}

const DistributionJobsTableAlertAction = ({
    isAutoSendingEmail,
    onAutoSendEmail,
    isDownloadingExcel,
    onDownloadExcel,
    isConfirmingCompleted,
    onConfirmCompleted,
}: DistributionJobsTableAlertActionProps) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <Space size={16}>
            <Button
                type="text"
                icon={<MailOutlined />}
                loading={isAutoSendingEmail}
                onClick={onAutoSendEmail}
                style={{ color: token.colorPrimary }}
            >
                {messages('distributionJobs.autoSendEmail')}
            </Button>
            <Button
                type="text"
                icon={<FileExcelOutlined />}
                loading={isDownloadingExcel}
                onClick={onDownloadExcel}
                style={{ color: token.colorPrimary }}
            >
                {messages('distributionJobs.downloadExcel')}
            </Button>
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
