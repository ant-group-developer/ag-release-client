import { Form, Modal, Select, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import {
    RunFtpReportFileDiscoveryPayload,
    useRunFtpReportFileDiscovery,
} from '../../hooks/use-run-ftp-report-file-discovery';

interface RunFtpFileDiscoveryModalProps {
    open: boolean;
    onCancel: () => void;
}

export const RunFtpFileDiscoveryModal = ({
    open,
    onCancel,
}: RunFtpFileDiscoveryModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm<RunFtpReportFileDiscoveryPayload>();
    const { runFtpReportFileDiscovery, isPending } =
        useRunFtpReportFileDiscovery();

    const categoryOptions = [
        { label: 'All', value: 'all' },
        { label: 'Trends', value: 'trends' },
        { label: 'Sales', value: 'sales' },
        { label: 'Usage', value: 'usage' },
    ];

    const handleSubmit = (values: RunFtpReportFileDiscoveryPayload) => {
        runFtpReportFileDiscovery(values, {
            onSuccess: () => {
                form.resetFields();
                onCancel();
            },
        });
    };

    return (
        <Modal
            title={messages('dspReport.fileDiscoveryRuns.runTitle')}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={isPending}
            okText={messages('dspReport.fileDiscoveryRuns.runButton')}
            cancelText={messages('common.remove')}
            destroyOnClose
            centered
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    force: false,
                    categories: ['all'],
                }}
                onFinish={handleSubmit}
                className="mt-4"
            >
                <Form.Item
                    name="categories"
                    label={messages('dspReport.fileDiscoveryRuns.categories')}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        options={categoryOptions}
                    />
                </Form.Item>

                <Form.Item
                    name="force"
                    label={messages('dspReport.fileDiscoveryRuns.force')}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RunFtpFileDiscoveryModal;
