import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TracksSelect from '@/components/ui/select/tracks-select';
import useModalStore from '@/hooks/use-modal';
import { TrackData } from '@/modules/releases/types';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting-public';
import { Checkbox, Form, InputNumber, Popover } from 'antd';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useMemo } from 'react';
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
    const { settingConfig } = useGetSettingPublic();
    const acrConfig = settingConfig?.acrCloud;

    const trackIds = useMemo(
        () =>
            Array.from(
                new Set(
                    [...(selectedTrackIds ?? []), dataEdit?.id].filter(Boolean)
                )
            ),
        [selectedTrackIds, dataEdit?.id]
    );

    const handleSubmit = (values: any) => {
        const { date, track, ...rest } = values;

        const payload = {
            trackIds: values?.track ?? trackIds,
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
            track: trackIds,
            chunkDuration: acrConfig?.chunkDuration,
        });
    }, [trackIds, acrConfig?.chunkDuration, form]);

    return (
        <AppModal
            open
            title={`${messages('common.scan')} ACRCloud`}
            onCancel={closeModal}
            onOk={form.submit}
            okText={messages('common.scan')}
            width={640}
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
                <AppFormItem name="track" label={messages('track.label')}>
                    <TracksSelect
                        mode="multiple"
                        open={false}
                        suffixIcon={null}
                        tagRender={({ label }) => (
                            <span className="ant-select-selection-item">
                                <span className="ant-select-selection-item-content">
                                    {label}
                                </span>
                            </span>
                        )}
                        maxTagCount="responsive"
                        maxTagPlaceholder={(omittedValues) => (
                            <Popover
                                trigger="hover"
                                title={`${omittedValues.length} ${messages('common.others')}`}
                                content={
                                    <div className="max-h-60 max-w-xs overflow-y-auto space-y-1 py-1">
                                        {omittedValues.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="truncate py-0.5 text-xs"
                                            >
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                }
                            >
                                <span className="cursor-pointer">
                                    +{omittedValues.length}{' '}
                                    {messages('common.others')}
                                </span>
                            </Popover>
                        )}
                        idInclude={trackIds}
                    />
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
                    label={messages('track.chunkDuration.label')}
                    tooltipInfo={messages('track.chunkDuration.tooltip')}
                    rules={[
                        {
                            type: 'number',
                            max: 12,
                            message: messages('validation.numberMax', {
                                max: 12,
                                field: messages('track.chunkDuration.label'),
                            }),
                        },
                        {
                            type: 'number',
                            min: 1,
                            message: messages('validation.numberMin', {
                                min: 1,
                                field: messages('track.chunkDuration.label'),
                            }),
                        },
                    ]}
                >
                    <InputNumber
                        addonAfter={messages('common.seconds')}
                        style={{ width: 170 }}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}

