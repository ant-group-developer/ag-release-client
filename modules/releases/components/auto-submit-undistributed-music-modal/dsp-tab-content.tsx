'use client';

import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import DspSelectionTable from '../bulk-submit-modal/dsp-selection-table';

interface DspTabContentProps {
    dspDataFilter: any[];
    isFetchingDsp: boolean;
}

const DspTabContent = ({
    dspDataFilter,
    isFetchingDsp,
}: DspTabContentProps) => {
    const messages = useTranslations();
    return (
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
                    y: 250,
                    x: 'max-content',
                }}
            />
        </Form.Item>
    );
};

export default DspTabContent;
