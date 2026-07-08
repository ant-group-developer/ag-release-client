'use client';

import { DspData } from '@/modules/dsp/types';
import { Alert, Form, FormInstance, Select, Switch, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { CI_IMPORT_ACTION } from '../../enums';
import DspSelectionTable from '../bulk-submit-modal/dsp-selection-table';

export interface AutoSubmitV2FormValues {
    dspCodes: string[];
    ciImportAction?: CI_IMPORT_ACTION;
    skipDistributed?: boolean;
}

interface SubmitConfigFormProps {
    form: FormInstance<AutoSubmitV2FormValues>;
    dspDataFilter: DspData[];
    isFetchingDsp: boolean;
    defaultDspCodes: string[];
}

export default function SubmitConfigForm({
    form,
    dspDataFilter,
    isFetchingDsp,
    defaultDspCodes,
}: SubmitConfigFormProps) {
    const messages = useTranslations();
    const ciImportAction = Form.useWatch('ciImportAction', form) || CI_IMPORT_ACTION.SKIP_CI_IMPORT;

    const ciImportActionDesc = useMemo(() => {
        switch (ciImportAction) {
            case CI_IMPORT_ACTION.KEEP_CURRENT_STATUS:
                return messages('release.autoSubmitV2.keepCurrentStatusDesc');
            case CI_IMPORT_ACTION.SKIP_CI_IMPORT:
                return messages('release.autoSubmitV2.skipCiImportDesc');
            case CI_IMPORT_ACTION.FORCE_CI_IMPORT:
                return messages('release.autoSubmitV2.forceCiImportDesc');
            default:
                return null;
        }
    }, [ciImportAction, messages]);

    return (
        <Form form={form} layout="vertical" className="w-[50vw]">
            <Tabs
                size="small"
                type="card"
                items={[
                    {
                        key: 'dsps',
                        label: messages('release.autoSubmitDspTab'),
                        children: (
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
                                    scroll={{
                                        x: 'max-content',
                                        y: 220,
                                    }}
                                />
                            </Form.Item>
                        ),
                    },
                    {
                        key: 'options',
                        label: messages('release.autoSubmitOptionsTab'),
                        children: (
                            <>
                                <Form.Item
                                    name="ciImportAction"
                                    label={messages(
                                        'release.autoSubmitV2.ciImportAction'
                                    )}
                                    initialValue={
                                        CI_IMPORT_ACTION.SKIP_CI_IMPORT
                                    }
                                    style={{ marginBottom: 0 }}
                                    extra={
                                        ciImportActionDesc && (
                                            <Alert
                                                type="info"
                                                showIcon
                                                message={ciImportActionDesc}
                                                style={{ marginTop: 8 }}
                                            />
                                        )
                                    }
                                >
                                    <Select
                                        options={[
                                            {
                                                value: CI_IMPORT_ACTION.KEEP_CURRENT_STATUS,
                                                label: messages(
                                                    'release.autoSubmitV2.keepCurrentStatus'
                                                ),
                                            },
                                            {
                                                value: CI_IMPORT_ACTION.SKIP_CI_IMPORT,
                                                label: messages(
                                                    'release.autoSubmitV2.skipCiImport'
                                                ),
                                            },
                                            {
                                                value: CI_IMPORT_ACTION.FORCE_CI_IMPORT,
                                                label: messages(
                                                    'release.autoSubmitV2.forceCiImport'
                                                ),
                                            },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="skipDistributed"
                                    label={messages(
                                        'release.autoSubmitV2.skipDistributed'
                                    )}
                                    valuePropName="checked"
                                    initialValue
                                >
                                    <Switch />
                                </Form.Item>
                            </>
                        ),
                    },
                ]}
            />
        </Form>
    );
}
