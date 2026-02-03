import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TracksSelect from '@/components/ui/select/tracks-select';
import useModalStore from '@/hooks/use-modal';
import { TrackData } from '@/modules/releases/types';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';
import { Checkbox, Form, InputNumber } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useEffect } from 'react';
import { useScanTracks } from '../../hooks/use-scan-tracks';

type Props = Omit<AppModalProps, 'children'> & {
    selectedTrackIds?: Key[];
    handleResetSelectedRow?: () => void;
    hideSkipScannedOption?: boolean;
};

export default function AcrCloudScanModal({
    selectedTrackIds,
    handleResetSelectedRow,
    hideSkipScannedOption = false,
    ...props
}: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const [form] = Form.useForm();
    const { scanTracks, isPending: isPendingScan } = useScanTracks();
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);
    const { settingData } = useGetSettingPublic();
    const acrConfig = settingData?.acrCloud;

    const handleSubmit = (values: any) => {
        const { date, track, ...rest } = values;

        const payload = {
            trackIds: values?.track,
            ...rest,
        };
        scanTracks({
            filter: payload,
            onSuccess: () => {
                closeModal();
                handleResetSelectedRow?.();
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            track: Array.from(
                new Set(
                    [...(selectedTrackIds ?? []), dataEdit?.id].filter(Boolean)
                )
            ),
            chunkDuration: acrConfig?.chunkDuration,
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

                <AppFormItem name="track" label={messages('track.label')}>
                    <TracksSelect mode="multiple" allowClear disabled />
                </AppFormItem>
                {!hideSkipScannedOption && (
                    <AppFormItem
                        valuePropName="checked"
                        name="ignoreTrackScanned"
                        label="Option"
                    >
                        <Checkbox>
                            {messages('track.skipScannedTracks')}
                        </Checkbox>
                    </AppFormItem>
                )}
                <AppFormItem
                    name="chunkDuration"
                    label={messages('track.chunkDuration')}
                    rules={[
                        {
                            type: 'number',
                            max: 12,
                            message: messages('validation.stringMax', {
                                max: 12,
                                field: messages('track.chunkDuration'),
                            }),
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: messages('validation.stringMin', {
                                min: 1,
                                field: messages('track.chunkDuration'),
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
