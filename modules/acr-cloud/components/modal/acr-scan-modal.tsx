import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TracksSelect from '@/components/ui/select/tracks-select';
import useModalStore from '@/hooks/use-modal';
import { Checkbox, Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useState } from 'react';
import { useScanTracks } from '../../hooks/use-scan-tracks';

type Props = Omit<AppModalProps, 'children'> & {
    selectedTrackIds?: Key[];
    handleResetSelectedRow: () => void;
};

export default function AcrCloudScanModal({
    selectedTrackIds,
    handleResetSelectedRow,
    ...props
}: Props) {
    const defaultStart = dayjs()
        .subtract(30, 'day')
        .startOf('day')
        .toISOString();
    const defaultEnd = dayjs().endOf('day').toISOString();
    const [tempStartDate, setTempStartDate] = useState<string>(defaultStart);
    const [tempEndDate, setTempEndDate] = useState<string>(defaultEnd);
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const [form] = Form.useForm();
    const { scanTracks, isPending: isPendingScan } = useScanTracks();

    const handleSubmit = (values: any) => {
        const { date, ...rest } = values;
        const trackCreatedAtStart = dayjs(date[0]).toISOString();
        const trackCreatedAtEnd = dayjs(date[1]).toISOString();
        const payload = {
            trackCreatedAtStart,
            trackCreatedAtEnd,
            ...rest,
        };
        scanTracks({
            filter: payload,
            onSuccess: () => {
                closeModal();
                handleResetSelectedRow();
            },
        });
    };

    const handleDateChange = (
        startDateRelease: string | undefined,
        endDateRelease: string | undefined
    ) => {
        setTempStartDate(startDateRelease || '');
        setTempEndDate(endDateRelease || '');
    };

    useEffect(() => {
        form.setFieldsValue({
            ignoreTrackScanned: true,
            date: [dayjs(defaultStart), dayjs(defaultEnd)],
            track: selectedTrackIds,
        });
    });

    return (
        <AppModal
            open
            title={`${messages('common.scan')} ACRCloud`}
            onCancel={closeModal}
            onOk={form.submit}
            okText={messages('common.scan')}
            width={750}
            loading={isPendingScan}
            {...props}
        >
            <AppForm
                layout="horizontal"
                form={form}
                showSubmit={false}
                onFinish={(values) => handleSubmit(values)}
                disabled={isPendingScan}
            >
                <AppFormItem
                    required
                    name="date"
                    label={messages('common.dateCreated')}
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: messages('validation.input'),
                    //     },
                    // ]}
                >
                    <DateRangePicker
                        className="w-full"
                        allowClear
                        value={
                            tempStartDate && tempEndDate
                                ? [dayjs(tempStartDate), dayjs(tempEndDate)]
                                : undefined
                        }
                        externalOnChange={handleDateChange}
                        placement="topLeft"
                        disabledDate={(current) =>
                            current && current > dayjs().endOf('day')
                        }
                    />
                </AppFormItem>

                <AppFormItem name="track" label={messages('tracks.label')}>
                    <TracksSelect mode="multiple" allowClear />
                </AppFormItem>
                <AppFormItem
                    valuePropName="checked"
                    name="ignoreTrackScanned"
                    label="Option"
                >
                    <Checkbox defaultChecked={true}>
                        {messages('tracks.skipScannedTracks')}
                    </Checkbox>
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
