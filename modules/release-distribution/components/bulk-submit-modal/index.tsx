'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import DspSelectionTable from '@/modules/releases/components/bulk-submit-modal/dsp-selection-table';
import { useBulkSubmitRelease } from '@/modules/releases/hooks/use-bulk-submit-release';
import { Alert, Button, Form, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

interface FormValues {
    dspCodes: string[];
    needImportAgain: boolean;
    skipDistributed: boolean;
}

interface BulkSubmitModalProps {
    open: boolean;
    selectedReleaseIds: string[];
    onCancel: () => void;
    onSuccess: () => void;
}

export default function BulkSubmitModal({
    open,
    selectedReleaseIds,
    onCancel,
    onSuccess,
}: BulkSubmitModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm<FormValues>();

    const { bulkSubmitRelease, isPending: isSubmitting } =
        useBulkSubmitRelease();

    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        isActive: true,
    });

    const dspDataFilter = useMemo(() => {
        return dspData?.items?.filter((item) => !!item.codeCi) || [];
    }, [dspData?.items]);

    const defaultDspCodes = useMemo(() => {
        return dspDataFilter.map((item) => item.code);
    }, [dspDataFilter]);

    useEffect(() => {
        if (open && defaultDspCodes.length > 0) {
            form.setFieldsValue({
                dspCodes: defaultDspCodes,
                needImportAgain: false,
                skipDistributed: true,
            });
        }
    }, [open, defaultDspCodes, form]);

    const onFinish = (values: FormValues) => {
        if (!selectedReleaseIds.length) return;

        bulkSubmitRelease({
            payload: {
                ids: selectedReleaseIds,
                codes: values.dspCodes,
                needImportAgain: values.needImportAgain ?? false,
                skipDistributed: values.skipDistributed ?? true,
            },
            onSuccess: () => {
                onSuccess();
                onCancel();
            },
        });
    };

    return (
        <AppModal
            open={open}
            title={messages('release.bulkSubmit')}
            onCancel={onCancel}
            width={720}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    disabled={!selectedReleaseIds.length}
                    onClick={() => form.submit()}
                >
                    {messages('common.submit')}
                </Button>,
            ]}
            centered
        >
            <div className="flex flex-col gap-4 py-2">
                {selectedReleaseIds.length > 0 && (
                    <Alert
                        type="info"
                        showIcon
                        message={messages(
                            'release.autoSubmitV2.selectedCount',
                            {
                                count: selectedReleaseIds.length,
                            }
                        )}
                    />
                )}

                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    initialValues={{
                        needImportAgain: false,
                        skipDistributed: true,
                    }}
                >
                    <Form.Item
                        name="dspCodes"
                        label={messages('placeholder.selectDsp')}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <DspSelectionTable
                            dataSource={dspDataFilter}
                            loading={isFetchingDsp}
                        />
                    </Form.Item>

                    <Form.Item
                        name="needImportAgain"
                        label={messages('release.autoSubmitV2.needImportAgain')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="skipDistributed"
                        label={messages('release.autoSubmitV2.skipDistributed')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </div>
        </AppModal>
    );
}
