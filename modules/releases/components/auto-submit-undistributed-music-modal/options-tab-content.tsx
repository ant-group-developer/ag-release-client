'use client';

import { Checkbox, Form, Select } from 'antd';
import { useTranslations } from 'next-intl';

interface OptionsTabContentProps {
    statusOptions: Array<{ label: string; value: string }>;
}

const OptionsTabContent = ({ statusOptions }: OptionsTabContentProps) => {
    const messages = useTranslations();
    return (
        <div className="flex flex-col">
            <Form.Item
                name="status"
                label={messages('common.status')}
                style={{ marginBottom: 12 }}
            >
                <Select
                    placeholder={messages('select.option')}
                    options={statusOptions}
                    allowClear
                />
            </Form.Item>

            <Form.Item
                name="neverExported"
                valuePropName="checked"
                initialValue={true}
                style={{ marginBottom: 8 }}
            >
                <Checkbox>{messages('releaseCiData.neverExported')}</Checkbox>
            </Form.Item>

            <Form.Item
                name="lastImportFailed"
                valuePropName="checked"
                initialValue={false}
                style={{ marginBottom: 8 }}
            >
                <Checkbox>{messages('releaseCiData.lastImportIsFailed')}</Checkbox>
            </Form.Item>
        </div>
    );
};

export default OptionsTabContent;
