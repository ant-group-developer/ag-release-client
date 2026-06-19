import { DatePicker, Form, Modal, Select, Switch } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useStartFtpSync } from '../../hooks/use-sync-config';

interface SyncModalProps {
    open: boolean;
    onClose: () => void;
}

export default function SyncModal({ open, onClose }: SyncModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { startFtpSync, isPending } = useStartFtpSync();

    const now = dayjs();
    const currentQuarterStart = now
        .startOf('year')
        .add(Math.floor(now.month() / 3) * 3, 'month');

    const presets = [
        {
            label: now.format('MM/YYYY'),
            value: [now.startOf('month'), now.endOf('month')] as [Dayjs, Dayjs],
        },
        {
            label: now.subtract(1, 'month').format('MM/YYYY'),
            value: [
                now.subtract(1, 'month').startOf('month'),
                now.subtract(1, 'month').endOf('month'),
            ] as [Dayjs, Dayjs],
        },
        {
            label: now.subtract(2, 'month').format('MM/YYYY'),
            value: [
                now.subtract(2, 'month').startOf('month'),
                now.subtract(2, 'month').endOf('month'),
            ] as [Dayjs, Dayjs],
        },
        {
            label:
                messages(
                    'reportConfigs.sftpExcludePatterns.sync.preset.thisQuarter'
                ) || 'Quý này',
            value: [
                currentQuarterStart,
                currentQuarterStart.add(2, 'month').endOf('month'),
            ] as [Dayjs, Dayjs],
        },
        {
            label:
                messages(
                    'reportConfigs.sftpExcludePatterns.sync.preset.prevQuarter'
                ) || 'Quý trước',
            value: [
                currentQuarterStart.subtract(3, 'month'),
                currentQuarterStart.subtract(1, 'month').endOf('month'),
            ] as [Dayjs, Dayjs],
        },
        {
            label: now.format('YYYY'),
            value: [now.startOf('year'), now.endOf('year')] as [Dayjs, Dayjs],
        },
        {
            label: now.subtract(1, 'year').format('YYYY'),
            value: [
                now.subtract(1, 'year').startOf('year'),
                now.subtract(1, 'year').endOf('year'),
            ] as [Dayjs, Dayjs],
        },
        {
            label: now.subtract(2, 'year').format('YYYY'),
            value: [
                now.subtract(2, 'year').startOf('year'),
                now.subtract(2, 'year').endOf('year'),
            ] as [Dayjs, Dayjs],
        },
    ];

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const range = values.periodRange as [Dayjs, Dayjs];
                if (!range || range.length !== 2) {
                    return;
                }

                const [start, end] = range;
                const force = !!values.force;
                const categories = values.categories || [];

                startFtpSync(
                    {
                        month_start: start.format('YYYYMM'),
                        month_end: end.format('YYYYMM'),
                        force,
                        categories,
                    },
                    {
                        onSuccess: () => {
                            onClose();
                        },
                    }
                );
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            open={open}
            title={messages(
                'reportConfigs.sftpExcludePatterns.sync.modalTitle'
            )}
            okText={messages('analytics2.syncAll.accept')}
            cancelText={messages('analytics2.syncAll.cancel')}
            onCancel={onClose}
            onOk={handleOk}
            destroyOnHidden
            confirmLoading={isPending}
            cancelButtonProps={{ disabled: isPending }}
        >
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: 20 }}
                initialValues={{
                    force: false,
                    periodRange: [dayjs(), dayjs()],
                }}
            >
                <Form.Item
                    name="periodRange"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.sync.period'
                    )}
                    rules={[
                        {
                            required: true,
                            message: messages(
                                'reportConfigs.sftpExcludePatterns.sync.requiredPeriod'
                            ),
                        },
                    ]}
                >
                    <DatePicker.RangePicker
                        picker="month"
                        style={{ width: '100%' }}
                        format="MM/YYYY"
                        presets={presets}
                    />
                </Form.Item>

                <Form.Item
                    name="categories"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.sync.categories'
                    )}
                    tooltip={messages(
                        'reportConfigs.sftpExcludePatterns.sync.categoriesTooltip'
                    )}
                    rules={[
                        {
                            required: true,
                            message: messages(
                                'reportConfigs.sftpExcludePatterns.sync.requiredCategories'
                            ),
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder={messages(
                            'reportConfigs.sftpExcludePatterns.sync.categoriesPlaceholder'
                        )}
                        style={{ width: '100%' }}
                        options={[
                            {
                                label: messages(
                                    'reportConfigs.sftpExcludePatterns.sync.salesLabel'
                                ),
                                value: 'sales',
                            },
                            {
                                label: messages(
                                    'reportConfigs.sftpExcludePatterns.sync.trendsLabel'
                                ),
                                value: 'trends',
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="force"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.sync.force'
                    )}
                    tooltip={messages(
                        'reportConfigs.sftpExcludePatterns.sync.forceTooltip'
                    )}
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren={messages('status.enable')}
                        unCheckedChildren={messages('status.disable')}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
