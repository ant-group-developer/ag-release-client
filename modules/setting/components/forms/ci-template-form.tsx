import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import DndUpload from '@/components/ui/input/dnd-upload';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { useActive } from '@/hooks/use-active';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { DownloadOutlined, FileOutlined } from '@ant-design/icons';
import { Button, Form, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

const { Text, Link } = Typography;

type Props = {};

export default function CiTemplateForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingConfig } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const existingFileId = settingConfig?.other?.fileCiTemplateId;

    // Fetch read URL for existing file
    useEffect(() => {
        if (existingFileId) {
            bucketApi
                .getLinkReadFile(existingFileId)
                .then((res) => {
                    setDownloadUrl(res?.data?.data || null);
                })
                .catch(() => {
                    setDownloadUrl(null);
                });
        } else {
            setDownloadUrl(null);
        }
    }, [existingFileId]);

    const onFinish = async (values: any) => {
        try {
            active();
            const file: File | undefined =
                values.ciTemplate?.fileList?.[0]?.originFileObj;

            if (!file) {
                deActive();
                return;
            }

            const fileId = await bucketApi.createBucket(file, {
                folderBucket: {
                    uploadPurpose: TYPE_UPLOAD_BUCKET.CI_TEMPLATE,
                },
                file: {
                    fileName: file.name,
                    contentType: file.type || 'application/octet-stream',
                    extension: file.name.split('.').pop() || '',
                    fileSize: file.size,
                },
            });

            await bucketApi.submit({ ids: [fileId] });

            const payload: UpdateSettingPayload = {
                other: {
                    fileCiTemplateId: fileId,
                },
            };

            updateSetting({
                payload,
                onSuccess: () => {
                    form.resetFields();
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

    const downloadFile = (fileUrl?: string, fileName?: string) => {
        if (!fileUrl) {
            console.error('No file URL');
            return;
        }

        try {
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName ? `${fileName}.xlsx` : '';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <div>
            {existingFileId && (
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <Text strong>
                        <FileOutlined style={{ marginRight: 8 }} />
                        {messages('setting.ciTemplate.currentFile')}:
                    </Text>{' '}
                    {downloadUrl ? (
                        <Link href={downloadUrl} target="_blank">
                            {existingFileId}
                        </Link>
                    ) : (
                        <Text type="secondary">{existingFileId}</Text>
                    )}
                    <Button
                        loading={isActive}
                        size="small"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={async () => {
                            try {
                                active();
                                const res =
                                    await bucketApi.getLinkDownloadFile(
                                        existingFileId
                                    );
                                deActive();
                                const url = res?.data?.data;
                                downloadFile(url, 'CI Template');
                            } catch (e) {
                                deActive();
                                console.error('Download failed', e);
                            }
                        }}
                    >
                        {messages('common.download')}
                    </Button>
                </div>
            )}

            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
                layout="vertical"
            >
                <AppFormItem
                    name="ciTemplate"
                    label="CI Template"
                    rules={[
                        {
                            required: !existingFileId,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <DndUpload
                        maxCount={1}
                        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        multiple={false}
                        beforeUpload={() => false}
                        disabled={isActive}
                    />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
