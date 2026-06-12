import { DatePicker, Form, Modal, Select, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useStartFtpSync, useStartFtpSyncAll } from '../../hooks/use-sync-config';

interface SyncModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SyncModal({ open, onClose }: SyncModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    
    const { startFtpSync, isPending: isSyncPending } = useStartFtpSync();
    const { startFtpSyncAll, isPending: isSyncAllPending } = useStartFtpSyncAll();
    const isPending = isSyncPending || isSyncAllPending;

    const syncMode = Form.useWatch('syncMode', form);

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const formattedPeriod = values.startPeriod.format('YYYYMM');
                const force = !!values.force;
                const categories = values.categories || [];

                if (values.syncMode === 'all') {
                    startFtpSyncAll(
                        { startPeriod: formattedPeriod, force, categories },
                        {
                            onSuccess: () => {
                                onClose();
                            },
                        }
                    );
                } else {
                    startFtpSync(
                        {
                            period: formattedPeriod,
                            force,
                            categories,
                        },
                        {
                            onSuccess: () => {
                                onClose();
                            },
                        }
                    );
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            open={open}
            title={messages('reportConfigs.sftpExcludePatterns.sync.modalTitle')}
            okText={messages('analytics2.syncAll.accept')}
            cancelText={messages('analytics2.syncAll.cancel')}
            onCancel={onClose}
            onOk={handleOk}
            destroyOnClose
            confirmLoading={isPending}
            cancelButtonProps={{ disabled: isPending }}
        >
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: 20 }}
                initialValues={{
                    syncMode: 'single',
                    force: false,
                }}
            >
                <Form.Item
                    name="syncMode"
                    label={messages('reportConfigs.sftpExcludePatterns.sync.syncMode')}
                >
                    <Select
                        options={[
                            {
                                label: messages('reportConfigs.sftpExcludePatterns.sync.syncModeSingle'),
                                value: 'single',
                            },
                            {
                                label: messages('reportConfigs.sftpExcludePatterns.sync.syncModeAll'),
                                value: 'all',
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="startPeriod"
                    label={
                        syncMode === 'all'
                            ? messages('reportConfigs.sftpExcludePatterns.sync.startPeriod')
                            : messages('reportConfigs.sftpExcludePatterns.sync.period')
                    }
                    rules={[
                        {
                            required: true,
                            message:
                                syncMode === 'all'
                                    ? messages('reportConfigs.sftpExcludePatterns.sync.requiredStartPeriod')
                                    : messages('reportConfigs.sftpExcludePatterns.sync.requiredPeriod'),
                        },
                    ]}
                >
                    <DatePicker
                        picker="month"
                        style={{ width: '100%' }}
                        format="MM/YYYY"
                    />
                </Form.Item>

                <Form.Item
                    name="categories"
                    label={messages('reportConfigs.sftpExcludePatterns.sync.categories')}
                    rules={[
                        {
                            required: true,
                            message: messages('reportConfigs.sftpExcludePatterns.sync.requiredCategories'),
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder={messages('reportConfigs.sftpExcludePatterns.sync.categoriesPlaceholder')}
                        style={{ width: '100%' }}
                        options={[
                            {
                                label: messages('reportConfigs.sftpExcludePatterns.sync.salesLabel'),
                                value: 'sales',
                            },
                            {
                                label: messages('reportConfigs.sftpExcludePatterns.sync.trendsLabel'),
                                value: 'trends',
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="force"
                    label={messages('reportConfigs.sftpExcludePatterns.sync.force')}
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
}
