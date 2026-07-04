'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useAutoSubmitUndistributedMusicRelease } from '@/modules/releases/hooks/use-auto-submit-undistributed-music-release';
import { Alert, Button, Form, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import DspSelectionTable from '../bulk-submit-modal/dsp-selection-table';

interface AutoSubmitUndistributedMusicModalProps {
    preview?: boolean;
    onFinished?: () => void;
}

interface AutoSubmitPreviewItem {
    releaseId: string;
    upc: string;
    dspCodes: string[];
}

interface AutoSubmitPreviewResult {
    totalReleases: number;
    items: AutoSubmitPreviewItem[];
}

const AutoSubmitUndistributedMusicModal = ({
    preview = false,
    onFinished,
}: AutoSubmitUndistributedMusicModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const [previewResult, setPreviewResult] =
        useState<AutoSubmitPreviewResult | null>(null);
    const { autoSubmitUndistributedMusicRelease, isPending: isSubmitting } =
        useAutoSubmitUndistributedMusicRelease(preview);

    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        isActive: true,
    });

    const dspDataFilter = useMemo(() => {
        return dspData?.items?.filter((item) => !!item.codeCi) || [];
    }, [dspData?.items]);

    useEffect(() => {
        if (dspDataFilter.length > 0) {
            form.setFieldsValue({
                dspCodes: dspDataFilter.map((item) => item.code),
            });
        }
    }, [dspDataFilter, form]);

    const onFinish = (values: { dspCodes: string[] }) => {
        autoSubmitUndistributedMusicRelease({
            payload: {
                dspCodes: values.dspCodes,
            },
            onSuccess: (data) => {
                if (preview) {
                    setPreviewResult(data);
                    return;
                }

                closeModal();
                onFinished?.();
            },
        });
    };

    const columns: ColumnsType<AutoSubmitPreviewItem> = [
        {
            title: 'Release ID',
            dataIndex: 'releaseId',
            width: 300,
            render: (_, record) => (
                <Paragraph className="!mb-0" copyable>
                    {record.releaseId}
                </Paragraph>
            ),
        },
        {
            title: 'UPC',
            dataIndex: 'upc',
            width: 160,
            render: (_, record) => (
                <Paragraph className="!mb-0" copyable>
                    {record.upc}
                </Paragraph>
            ),
        },
        {
            title: messages('common.dsps'),
            dataIndex: 'dspCodes',
            render: (_, record) => (
                <Space wrap size={[0, 4]}>
                    {record.dspCodes.map((code) => (
                        <Tag key={code}>{code}</Tag>
                    ))}
                </Space>
            ),
        },
    ];

    return (
        <AppModal
            open
            title={
                preview
                    ? messages('release.previewAutoSubmitUndistributedMusic')
                    : messages('release.autoSubmitUndistributedMusic')
            }
            onCancel={closeModal}
            width={'60vw'}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    onClick={() => form.submit()}
                >
                    {preview
                        ? messages('common.review')
                        : messages('common.submit')}
                </Button>,
            ]}
            centered
        >
            <div className="flex flex-col gap-4">
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="dspCodes"
                        label={messages('placeholder.selectDsp')}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                    >
                        <DspSelectionTable
                            dataSource={dspDataFilter}
                            loading={isFetchingDsp}
                        />
                    </Form.Item>
                </Form>

                {previewResult && (
                    <div className="border-t pt-4">
                        <Alert
                            className="mb-3"
                            type="info"
                            showIcon
                            message={messages(
                                'release.autoSubmitPreviewTotal',
                                {
                                    count: previewResult.totalReleases,
                                }
                            )}
                        />
                        <Table
                            rowKey="releaseId"
                            size="small"
                            columns={columns}
                            dataSource={previewResult.items}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                            }}
                            scroll={{ x: 760, y: 200 }}
                        />
                    </div>
                )}
            </div>
        </AppModal>
    );
};

export default AutoSubmitUndistributedMusicModal;
