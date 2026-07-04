'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { RELEASE_CI_DATA_STATUS } from '@/modules/release-distribution/enums';
import { useAutoSubmitUndistributedMusicRelease } from '@/modules/releases/hooks/use-auto-submit-undistributed-music-release';
import { Alert, Button, Form, Space, Table, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import DspTabContent from './dsp-tab-content';
import OptionsTabContent from './options-tab-content';

interface AutoSubmitUndistributedMusicModalProps {
    onFinished?: () => void;
}

export enum AUTO_SUBMIT_TAB_KEY {
    DSP = 'dsp',
    OPTIONS = 'options',
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
    onFinished,
}: AutoSubmitUndistributedMusicModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const [activeTab, setActiveTab] = useState<'dsp' | 'options'>(
        AUTO_SUBMIT_TAB_KEY.DSP
    );
    const [previewResult, setPreviewResult] =
        useState<AutoSubmitPreviewResult | null>(null);
    const {
        autoSubmitUndistributedMusicRelease: autoSubmitReal,
        isPending: isSubmitting,
    } = useAutoSubmitUndistributedMusicRelease(false);
    const {
        autoSubmitUndistributedMusicRelease: autoSubmitPreview,
        isPending: isPendingPreview,
    } = useAutoSubmitUndistributedMusicRelease(true);

    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        isActive: true,
    });

    const dspDataFilter = useMemo(() => {
        return dspData?.items?.filter((item) => !!item.codeCi) || [];
    }, [dspData?.items]);

    const statusOptions = useMemo(
        () => [
            {
                label: messages('releaseCiData.status.existsOnCi'),
                value: RELEASE_CI_DATA_STATUS.EXISTS_ON_CI,
            },
            {
                label: messages('releaseCiData.status.notFoundOnCi'),
                value: RELEASE_CI_DATA_STATUS.NOT_FOUND_ON_CI,
            },
        ],
        [messages]
    );

    useEffect(() => {
        if (dspDataFilter.length > 0) {
            form.setFieldsValue({
                dspCodes: dspDataFilter.map((item) => item.code),
            });
        }
    }, [dspDataFilter, form]);

    const handleAction = async (isPreview: boolean) => {
        try {
            const values = await form.validateFields();
            const autoSubmit = isPreview ? autoSubmitPreview : autoSubmitReal;

            autoSubmit({
                payload: {
                    dspCodes: values.dspCodes,
                    status: values.status,
                    neverExported: values.neverExported,
                    lastImportFailed: values.lastImportFailed,
                } as any,
                onSuccess: (data) => {
                    if (isPreview) {
                        setPreviewResult(data);
                        return;
                    }

                    closeModal();
                    onFinished?.();
                },
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
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
            title={messages('release.autoSubmitUndistributedMusic')}
            onCancel={closeModal}
            width={'60vw'}
            styles={{
                body: {
                    minHeight: 400,
                },
            }}
            footer={[
                <Button
                    key="review"
                    loading={isPendingPreview}
                    onClick={() => handleAction(true)}
                >
                    {messages('common.review')}
                </Button>,
                <Button key="cancel" onClick={closeModal}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    onClick={() => handleAction(false)}
                >
                    {messages('common.submit')}
                </Button>,
            ]}
            centered
            loading={isFetchingDsp}
        >
            <div className="flex flex-col">
                <Form form={form} layout="vertical">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) =>
                            setActiveTab(key as 'dsp' | 'options')
                        }
                        items={[
                            {
                                key: AUTO_SUBMIT_TAB_KEY.DSP,
                                label: 'DSPs',
                                children: (
                                    <DspTabContent
                                        dspDataFilter={dspDataFilter}
                                        isFetchingDsp={isFetchingDsp}
                                    />
                                ),
                            },
                            {
                                key: AUTO_SUBMIT_TAB_KEY.OPTIONS,
                                label: messages('common.optional'),
                                children: (
                                    <OptionsTabContent
                                        statusOptions={statusOptions}
                                    />
                                ),
                            },
                        ]}
                    />
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
