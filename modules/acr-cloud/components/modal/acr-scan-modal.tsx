import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TracksSelect from '@/components/ui/select/tracks-select';
import useModalStore from '@/hooks/use-modal';
import { TrackData } from '@/modules/releases/types';
import { Checkbox, Form, InputNumber } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useEffect } from 'react';
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
    // const defaultStart = dayjs()
    //     .subtract(30, 'day')
    //     .startOf('day')
    //     .toISOString();
    // const defaultEnd = dayjs().endOf('day').toISOString();
    // const [tempStartDate, setTempStartDate] = useState<string>(defaultStart);
    // const [tempEndDate, setTempEndDate] = useState<string>(defaultEnd);
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const [form] = Form.useForm();
    const { scanTracks, isPending: isPendingScan } = useScanTracks();
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);

    const handleSubmit = (values: any) => {
        const { date, track, ...rest } = values;
        // const trackCreatedAtStart = dayjs(date[0]).toISOString();
        // const trackCreatedAtEnd = dayjs(date[1]).toISOString();
        const payload = {
            // trackCreatedAtStart,
            // trackCreatedAtEnd,
            trackIds: values?.track,
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

    // const handleDateChange = (
    //     startDateRelease: string | undefined,
    //     endDateRelease: string | undefined
    // ) => {
    //     setTempStartDate(startDateRelease || '');
    //     setTempEndDate(endDateRelease || '');
    // };

    useEffect(() => {
        form.setFieldsValue({
            ignoreTrackScanned: true,
            // date: [dayjs(defaultStart), dayjs(defaultEnd)],
            track: Array.from(
                new Set(
                    [...(selectedTrackIds ?? []), dataEdit?.id].filter(Boolean)
                )
            ),
        });
    }, [selectedTrackIds]);

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
                {/* <AppFormItem
                    required
                    name="date"
                    label={messages('common.createdAt')}
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
                        defaultValue={
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
                </AppFormItem> */}

                <AppFormItem name="track" label={messages('tracks.label')}>
                    <TracksSelect mode="multiple" allowClear disabled />
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
                <AppFormItem
                    name="chunkDuration"
                    label={messages('tracks.chunkDuration')}
                    rules={[
                        {
                            type: 'number',
                            max: 12,
                            message: messages('validation.stringMax', {
                                max: 12,
                                field: messages('tracks.chunkDuration'),
                            }),
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: messages('validation.stringMin', {
                                min: 1,
                                field: messages('tracks.chunkDuration'),
                            }),
                        },
                    ]}
                >
                    <InputNumber />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
