import AppFormItem from '@/components/ui/antd-form/form-Item';
import { ReleasesData } from '@/modules/releases/types';
import {
    CheckOutlined,
    EditOutlined,
    LockOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
import { Form, FormInstance, Input, Popconfirm, theme, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

interface YoutubeIdFieldProps {
    form: FormInstance;
    dataEdit?: ReleasesData;
    onFieldUpdate?: (payload: Record<string, any>) => void;
    disabled?: boolean;
}

export default function YoutubeIdField({
    form,
    dataEdit,
    onFieldUpdate,
    disabled: parentDisabled = false,
}: YoutubeIdFieldProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [isLocked, setIsLocked] = useState<boolean>(false);

    // Watch the current value of the externalId field in the form
    const externalIdValue = Form.useWatch(['video', 'externalId'], form);

    // Lock the field by default if there is an existing externalId in the API data
    useEffect(() => {
        if (dataEdit?.video?.externalId) {
            setIsLocked(true);
        } else {
            setIsLocked(false);
        }
    }, [dataEdit?.video?.externalId]);

    const handleUnlock = () => {
        setIsLocked(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const urlRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = val.match(urlRegex);
        if (match && match[1]) {
            const extractedId = match[1];
            form.setFieldValue(['video', 'externalId'], extractedId);
            form.validateFields([['video', 'externalId']]);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value.trim();
        let finalVal = val;

        const urlRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = val.match(urlRegex);
        if (match && match[1]) {
            finalVal = match[1];
            form.setFieldValue(['video', 'externalId'], finalVal);
            form.validateFields([['video', 'externalId']]);
        }
    };

    const handleSave = () => {
        const val = (form.getFieldValue(['video', 'externalId']) || '').trim();
        let finalVal = val;

        // Perform final URL extraction if needed
        const urlRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = val.match(urlRegex);
        if (match && match[1]) {
            finalVal = match[1];
            form.setFieldValue(['video', 'externalId'], finalVal);
        }

        const isValid = !finalVal || /^[a-zA-Z0-9_-]{11}$/.test(finalVal);
        if (isValid) {
            if (finalVal !== (dataEdit?.video?.externalId || '')) {
                onFieldUpdate?.({
                    video: {
                        externalId: finalVal || null,
                    },
                });
            }
            if (finalVal) {
                setIsLocked(true);
            }
        } else {
            form.validateFields([['video', 'externalId']]);
        }
    };

    const isFieldDisabled = parentDisabled || isLocked;
    const isValidYouTubeId =
        externalIdValue && /^[a-zA-Z0-9_-]{11}$/.test(externalIdValue);

    return (
        <AppFormItem label={messages('common.youtubeId')} className="mb-0">
            <div className="flex w-full items-center gap-2">
                <Form.Item
                    name={['video', 'externalId']}
                    noStyle
                    rules={[
                        {
                            pattern: /^[a-zA-Z0-9_-]{11}$/,
                            message: messages('validation.youtubeIdFormat'),
                        },
                    ]}
                >
                    <Input
                        placeholder="YouTube ID"
                        disabled={isFieldDisabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onPressEnter={handleSave}
                        suffix={
                            isLocked && !parentDisabled ? (
                                <Popconfirm
                                    title={messages(
                                        'releaseVideo.youtubeIdOverrideConfirm'
                                    )}
                                    onConfirm={handleUnlock}
                                    okText={messages('common.yes')}
                                    cancelText={messages('common.cancel')}
                                >
                                    <EditOutlined
                                        style={{
                                            color: token.colorTextSecondary,
                                            cursor: 'pointer',
                                        }}
                                        className="transition-opacity hover:opacity-80"
                                    />
                                </Popconfirm>
                            ) : isLocked ? (
                                <LockOutlined
                                    style={{
                                        color: token.colorTextDescription,
                                    }}
                                />
                            ) : !parentDisabled ? (
                                <CheckOutlined
                                    style={{
                                        color: token.colorTextSecondary,
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleSave}
                                    className="transition-opacity hover:opacity-80"
                                />
                            ) : null
                        }
                    />
                </Form.Item>

                {isValidYouTubeId && (
                    <Tooltip title={messages('releaseVideo.youtubeIdPreview')}>
                        <YoutubeOutlined
                            style={{ fontSize: '28px', color: '#ff0000' }}
                            className="flex cursor-pointer items-center justify-center transition-opacity hover:opacity-80"
                            onClick={() => {
                                const url = `https://www.youtube.com/watch?v=${externalIdValue}`;
                                window.open(url, '_blank');
                            }}
                        />
                    </Tooltip>
                )}
            </div>
        </AppFormItem>
    );
}
