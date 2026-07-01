import AppModal from '@/components/ui/modal/normal-modal';
import { ORDER } from '@/enums/common';
import {
    RELEASE_CI_DATA_COLUMNS_DISPLAY,
    RELEASE_CI_DATA_STATUS,
} from '@/modules/release-distribution/enums';
import { ReleaseCiDataFilter } from '@/modules/release-distribution/types';
import { Checkbox, Form, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

interface ExportModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: (values: ReleaseCiDataFilter) => void;
    confirmLoading?: boolean;
}

export default function ExportModal({
    open,
    onCancel,
    onOk,
    confirmLoading,
}: ExportModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();

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

    const fieldOrderOptions = useMemo(
        () => [
            {
                label: messages('common.updatedAt'),
                value: RELEASE_CI_DATA_COLUMNS_DISPLAY.UPDATED_AT,
            },
            {
                label: messages('common.createdAt'),
                value: RELEASE_CI_DATA_COLUMNS_DISPLAY.CREATED_AT,
            },
            {
                label: messages('releaseCiData.latestSyncedAt'),
                value: RELEASE_CI_DATA_COLUMNS_DISPLAY.LATEST_SYNCED_AT,
            },
            {
                label: messages('common.status'),
                value: RELEASE_CI_DATA_COLUMNS_DISPLAY.STATUS,
            },
        ],
        [messages]
    );

    const orderByOptions = useMemo(
        () => [
            {
                label: messages('common.sortDesc'),
                value: ORDER.DESC,
            },
            {
                label: messages('common.sortAsc'),
                value: ORDER.ASC,
            },
        ],
        [messages]
    );

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                status: RELEASE_CI_DATA_STATUS.EXISTS_ON_CI,
                neverExported: true,
                lastImportIsFailed: true,
                fieldOrder: RELEASE_CI_DATA_COLUMNS_DISPLAY.UPDATED_AT,
                orderBy: ORDER.DESC,
            });
        }
    }, [open, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const result: ReleaseCiDataFilter = {
                ...values,
                neverExported: values.neverExported ? 'true' : undefined,
                lastImportIsFailed: values.lastImportIsFailed
                    ? 'true'
                    : undefined,
            };
            onOk(result);
        });
    };

    return (
        <AppModal
            open={open}
            title={messages('common.export')}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            destroyOnClose
        >
            <Form form={form} layout="vertical" className="mt-4">
                <Form.Item
                    name="status"
                    label={messages('common.status')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <Select options={statusOptions} />
                </Form.Item>

                <Form.Item name="neverExported" valuePropName="checked">
                    <Checkbox>
                        {messages('releaseCiData.neverExported')}
                    </Checkbox>
                </Form.Item>

                <Form.Item name="lastImportIsFailed" valuePropName="checked">
                    <Checkbox>
                        {messages('releaseCiData.lastImportIsFailed')}
                    </Checkbox>
                </Form.Item>
            </Form>
        </AppModal>
    );
}
