'use client';

import { DspData } from '@/modules/dsp/types';
import { Form, FormInstance, Switch, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import DspSelectionTable from '../bulk-submit-modal/dsp-selection-table';

export interface AutoSubmitV2FormValues {
    dspCodes: string[];
    needImportAgain?: boolean;
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
                                    name="needImportAgain"
                                    label={messages(
                                        'release.autoSubmitV2.needImportAgain'
                                    )}
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Switch />
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
