import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { useActive } from '@/hooks/use-active';
import { Form, InputNumber, Select, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

const { Text } = Typography;

type MultipartUploadFormValues = {
    partSizeValue?: number;
    partSizeUnit: 'MB' | 'GB';
    maxFileSizeValue?: number;
    maxFileSizeUnit: 'MB' | 'GB';
    presignExpiresValue?: number;
    presignExpiresUnit: number;
    sessionExpiresValue?: number;
    sessionExpiresUnit: number;
};

type Props = {};

export default function MultipartUploadForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<MultipartUploadFormValues>();
    const { settingConfig } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const multipartConfig = settingConfig?.multipartUpload;

    const partSizeValue = Form.useWatch('partSizeValue', form);
    const partSizeUnit = Form.useWatch('partSizeUnit', form);
    const maxFileSizeValue = Form.useWatch('maxFileSizeValue', form);
    const maxFileSizeUnit = Form.useWatch('maxFileSizeUnit', form);
    const presignExpiresValue = Form.useWatch('presignExpiresValue', form);
    const presignExpiresUnit = Form.useWatch('presignExpiresUnit', form);
    const sessionExpiresValue = Form.useWatch('sessionExpiresValue', form);
    const sessionExpiresUnit = Form.useWatch('sessionExpiresUnit', form);

    const onFinish = (values: MultipartUploadFormValues) => {
        try {
            active();

            const partSizeMb =
                values.partSizeUnit === 'GB'
                    ? Math.round(Number(values.partSizeValue) * 1024)
                    : Number(values.partSizeValue);

            const maxFileSizeMb =
                values.maxFileSizeUnit === 'GB'
                    ? Math.round(Number(values.maxFileSizeValue) * 1024)
                    : Number(values.maxFileSizeValue);

            const presignExpiresSeconds = Math.round(
                Number(values.presignExpiresValue) *
                    Number(values.presignExpiresUnit || 1)
            );

            const sessionExpiresSeconds = Math.round(
                Number(values.sessionExpiresValue) *
                    Number(values.sessionExpiresUnit || 1)
            );

            const payload: UpdateSettingPayload = {
                multipartUpload: {
                    partSizeMb,
                    maxFileSizeMb,
                    presignExpiresSeconds,
                    sessionExpiresSeconds,
                },
            };

            updateSetting({
                payload,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            });
        } catch (error) {
            deActive();
        }
    };

    useEffect(() => {
        if (!multipartConfig) return;

        // Phân rã MB sang MB hoặc GB
        const decomposeMb = (
            mb?: number
        ): { value?: number; unit: 'MB' | 'GB' } => {
            if (mb == null) return { value: undefined, unit: 'MB' };
            if (mb >= 1024 && mb % 1024 === 0) {
                return { value: mb / 1024, unit: 'GB' };
            }
            return { value: mb, unit: 'MB' };
        };

        // Phân rã số giây sang đơn vị lớn nhất phù hợp
        const decomposeSeconds = (
            sec?: number
        ): { value?: number; unit: number } => {
            if (sec == null) return { value: undefined, unit: 3600 };
            if (sec >= 86400 && sec % 86400 === 0) {
                return { value: sec / 86400, unit: 86400 };
            }
            if (sec >= 3600 && sec % 3600 === 0) {
                return { value: sec / 3600, unit: 3600 };
            }
            if (sec >= 60 && sec % 60 === 0) {
                return { value: sec / 60, unit: 60 };
            }
            return { value: sec, unit: 1 };
        };

        const partSize = decomposeMb(multipartConfig.partSizeMb);
        const maxFileSize = decomposeMb(multipartConfig.maxFileSizeMb);
        const presign = decomposeSeconds(multipartConfig.presignExpiresSeconds);
        const session = decomposeSeconds(multipartConfig.sessionExpiresSeconds);

        form.setFieldsValue({
            partSizeValue: partSize.value,
            partSizeUnit: partSize.unit,
            maxFileSizeValue: maxFileSize.value,
            maxFileSizeUnit: maxFileSize.unit,
            presignExpiresValue: presign.value,
            presignExpiresUnit: presign.unit,
            sessionExpiresValue: session.value,
            sessionExpiresUnit: session.unit,
        });
    }, [form, multipartConfig]);

    const timeUnitOptions = [
        { label: messages('common.seconds'), value: 1 },
        { label: messages('common.minutes'), value: 60 },
        { label: messages('common.hours'), value: 3600 },
        { label: messages('common.days'), value: 86400 },
    ];

    const sizeUnitOptions = [
        { label: 'MB', value: 'MB' },
        { label: 'GB', value: 'GB' },
    ];

    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
                initialValues={{
                    partSizeUnit: 'MB',
                    maxFileSizeUnit: 'GB',
                    presignExpiresUnit: 3600,
                    sessionExpiresUnit: 86400,
                }}
            >
                <AppFormItem
                    label={messages('setting.multipartUpload.partSizeMb')}
                    tooltipInfo={messages(
                        'setting.multipartUpload.partSizeMbTooltip'
                    )}
                    required
                >
                    <Space.Compact className="w-full">
                        <Form.Item
                            name="partSizeValue"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const unit =
                                            getFieldValue('partSizeUnit') ||
                                            'MB';
                                        const mb =
                                            unit === 'GB'
                                                ? Number(value) * 1024
                                                : Number(value);
                                        if (value == null || isNaN(value)) {
                                            return Promise.resolve();
                                        }
                                        if (mb < 5) {
                                            return Promise.reject(
                                                new Error(
                                                    messages(
                                                        'validation.numberMin',
                                                        {
                                                            min:
                                                                unit === 'GB'
                                                                    ? '0.005 GB (5 MB)'
                                                                    : '5 MB',
                                                            field: messages(
                                                                'setting.multipartUpload.partSizeMb'
                                                            ),
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                className="!w-full"
                                min={0.1}
                                step={1}
                                placeholder="128"
                            />
                        </Form.Item>
                        <Form.Item name="partSizeUnit" noStyle>
                            <Select
                                style={{ width: 100 }}
                                options={sizeUnitOptions}
                            />
                        </Form.Item>
                    </Space.Compact>
                    {partSizeUnit === 'GB' && partSizeValue ? (
                        <div className="mt-1">
                            <Text type="secondary" className="text-xs">
                                {messages('common.converted')}:{' '}
                                <Text strong>
                                    {(partSizeValue * 1024).toLocaleString()} MB
                                </Text>
                            </Text>
                        </div>
                    ) : null}
                </AppFormItem>

                <AppFormItem
                    label={messages('setting.multipartUpload.maxFileSizeMb')}
                    tooltipInfo={messages(
                        'setting.multipartUpload.maxFileSizeMbTooltip'
                    )}
                    required
                >
                    <Space.Compact className="w-full">
                        <Form.Item
                            name="maxFileSizeValue"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const unit =
                                            getFieldValue('maxFileSizeUnit') ||
                                            'MB';
                                        const mb =
                                            unit === 'GB'
                                                ? Number(value) * 1024
                                                : Number(value);
                                        if (value == null || isNaN(value)) {
                                            return Promise.resolve();
                                        }
                                        if (mb < 5) {
                                            return Promise.reject(
                                                new Error(
                                                    messages(
                                                        'validation.numberMin',
                                                        {
                                                            min:
                                                                unit === 'GB'
                                                                    ? '0.005 GB (5 MB)'
                                                                    : '5 MB',
                                                            field: messages(
                                                                'setting.multipartUpload.maxFileSizeMb'
                                                            ),
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                className="!w-full"
                                min={0.1}
                                step={1}
                                placeholder="100"
                            />
                        </Form.Item>
                        <Form.Item name="maxFileSizeUnit" noStyle>
                            <Select
                                style={{ width: 100 }}
                                options={sizeUnitOptions}
                            />
                        </Form.Item>
                    </Space.Compact>
                    {maxFileSizeValue ? (
                        <div className="mt-1">
                            <Text type="secondary" className="text-xs">
                                {messages('common.converted')}:{' '}
                                <Text strong>
                                    {maxFileSizeUnit === 'GB'
                                        ? `${(maxFileSizeValue * 1024).toLocaleString()} MB`
                                        : `${(maxFileSizeValue / 1024).toFixed(maxFileSizeValue % 1024 === 0 ? 0 : 2)} GB`}
                                </Text>
                            </Text>
                        </div>
                    ) : null}
                </AppFormItem>

                <AppFormItem
                    label={messages(
                        'setting.multipartUpload.presignExpiresSeconds'
                    )}
                    tooltipInfo={messages(
                        'setting.multipartUpload.presignExpiresSecondsTooltip'
                    )}
                    required
                >
                    <Space.Compact className="w-full">
                        <Form.Item
                            name="presignExpiresValue"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const multiplier =
                                            Number(
                                                getFieldValue(
                                                    'presignExpiresUnit'
                                                )
                                            ) || 1;
                                        const sec = Number(value) * multiplier;
                                        if (value == null || isNaN(value)) {
                                            return Promise.resolve();
                                        }
                                        if (sec < 60) {
                                            return Promise.reject(
                                                new Error(
                                                    messages(
                                                        'validation.numberMin',
                                                        {
                                                            min: '60 giây (1 phút)',
                                                            field: messages(
                                                                'setting.multipartUpload.presignExpiresSeconds'
                                                            ),
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        if (sec > 86400) {
                                            return Promise.reject(
                                                new Error(
                                                    messages(
                                                        'validation.numberMax',
                                                        {
                                                            max: '86.400 giây (24 giờ)',
                                                            field: messages(
                                                                'setting.multipartUpload.presignExpiresSeconds'
                                                            ),
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                className="!w-full"
                                min={0.1}
                                step={1}
                                placeholder="1"
                            />
                        </Form.Item>
                        <Form.Item name="presignExpiresUnit" noStyle>
                            <Select
                                style={{ width: 110 }}
                                options={timeUnitOptions}
                            />
                        </Form.Item>
                    </Space.Compact>
                    {presignExpiresValue ? (
                        <div className="mt-1">
                            <Text type="secondary" className="text-xs">
                                {messages('common.converted')}:{' '}
                                <Text strong>
                                    {Math.round(
                                        Number(presignExpiresValue) *
                                            Number(presignExpiresUnit || 1)
                                    ).toLocaleString()}{' '}
                                    {messages('common.seconds')}
                                </Text>
                            </Text>
                        </div>
                    ) : null}
                </AppFormItem>

                <AppFormItem
                    label={messages(
                        'setting.multipartUpload.sessionExpiresSeconds'
                    )}
                    tooltipInfo={messages(
                        'setting.multipartUpload.sessionExpiresSecondsTooltip'
                    )}
                    required
                >
                    <Space.Compact className="w-full">
                        <Form.Item
                            name="sessionExpiresValue"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const multiplier =
                                            Number(
                                                getFieldValue(
                                                    'sessionExpiresUnit'
                                                )
                                            ) || 1;
                                        const sec = Number(value) * multiplier;
                                        if (value == null || isNaN(value)) {
                                            return Promise.resolve();
                                        }
                                        if (sec < 3600) {
                                            return Promise.reject(
                                                new Error(
                                                    messages(
                                                        'validation.numberMin',
                                                        {
                                                            min: '3.600 giây (1 giờ)',
                                                            field: messages(
                                                                'setting.multipartUpload.sessionExpiresSeconds'
                                                            ),
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        if (sec > 604800) {
                                            return Promise.reject(
                                                new Error(
                                                    messages(
                                                        'validation.numberMax',
                                                        {
                                                            max: '604.800 giây (7 ngày)',
                                                            field: messages(
                                                                'setting.multipartUpload.sessionExpiresSeconds'
                                                            ),
                                                        }
                                                    )
                                                )
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <InputNumber
                                className="!w-full"
                                min={0.1}
                                step={1}
                                placeholder="1"
                            />
                        </Form.Item>
                        <Form.Item name="sessionExpiresUnit" noStyle>
                            <Select
                                style={{ width: 110 }}
                                options={timeUnitOptions}
                            />
                        </Form.Item>
                    </Space.Compact>
                    {sessionExpiresValue ? (
                        <div className="mt-1">
                            <Text type="secondary" className="text-xs">
                                {messages('common.converted')}:{' '}
                                <Text strong>
                                    {Math.round(
                                        Number(sessionExpiresValue) *
                                            Number(sessionExpiresUnit || 1)
                                    ).toLocaleString()}{' '}
                                    {messages('common.seconds')}
                                </Text>
                            </Text>
                        </div>
                    ) : null}
                </AppFormItem>
            </AppForm>
        </div>
    );
}
