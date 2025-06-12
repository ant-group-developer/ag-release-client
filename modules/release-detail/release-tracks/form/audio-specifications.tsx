import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import TimeInput from '@/components/ui/input/time-input';
import CountrySelect from '@/components/ui/select/country-select';
import extractAudioMetadata from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props = {
    trackData: TrackData;
    checkTrackValid: (boolean: boolean) => void;
};

export interface AudioMetadata {
    format: string;
    codec: string;
    bitrate: number;
    sampleRate: number;
    channels: number;
    duration: number;
    bitDepth: number;
    mqs: string;
}

export default function AudioSpecifications({
    trackData,
    checkTrackValid,
}: Props) {
    const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
    const { file } = trackData;
    const [form] = useForm();
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);

    const getMetadata = async () => {
        try {
            const metadata = await extractAudioMetadata(file);
            return metadata;
        } catch (error) {
            console.error('Error extracting metadata:', error);
            return null;
        }
    };

    const handleValuesChange = () => {
        setTimeout(() => {
            form.validateFields()
                .then((values) => {
                    console.log('audio valid', values);
                    checkTrackValid(true);
                })
                .catch((error) => {
                    console.log('audio invalid', error);
                    checkTrackValid(false);
                });
        }, 0);
    };

    useEffect(() => {
        form.setFieldsValue({
            ...formValues,
            fileName: file.name,
        });
        getMetadata().then((metadata) => {
            setMetadata(metadata);
        });

        form.validateFields()
            .then((values) => {
                console.log('audio valid');
                checkTrackValid(true);
            })
            .catch((error) => {
                checkTrackValid(false);
            });
    }, [formValues, form]);

    return (
        <div>
            <AppForm
                form={form}
                initialValues={formValues}
                layout="vertical"
                showSubmit={false}
                onValuesChange={() => handleValuesChange()}
            >
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <AppFormItem
                            label="Tên File"
                            name="fileName"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Input />
                        </AppFormItem>

                        {/* <AppFormItem
                            label="WMG Registered Filename"
                            name="registeredFilename"
                        >
                            <Input />
                        </AppFormItem> */}
                        <AppFormItem
                            label="Quốc gia ghi âm"
                            name="countryRecording"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <CountrySelect showSearch allowClear />
                        </AppFormItem>
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div className="grid grid-cols-2">
                                <AppFormItem
                                    label="Đoạn nghe mẫu"
                                    name="previewTrack"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <TimeInput />
                                </AppFormItem>
                                <AppFormItem
                                    label="Hook bài hát"
                                    name="previewTrack"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <TimeInput />
                                </AppFormItem>
                            </div>
                            <AppFormItem
                                label="Thể loại bản ghi"
                                name="previewTrack"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <Select
                                    options={[
                                        {
                                            label: 'Sound Recording (Music work)',
                                            value: '1',
                                        },
                                        {
                                            label: 'Sound Recording (Non music work)',
                                            value: '2',
                                        },
                                    ]}
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 rounded-md border p-2">
                        <div>
                            <p className="font-bold">Codec</p>
                            <p className="text-xs"> {metadata?.codec} </p>
                        </div>
                        <div>
                            <p className="font-bold">Bit Depth</p>
                            <p className="text-xs">{metadata?.bitDepth}</p>
                        </div>
                        <div>
                            <p className="font-bold">Bitrate</p>
                            <p className="text-xs"> {metadata?.bitrate} </p>
                        </div>
                        <div>
                            <p className="font-bold">Format</p>
                            <p className="text-xs">{metadata?.format}</p>
                        </div>
                        <div>
                            <p className="font-bold">Channels</p>
                            <p className="text-xs"> {metadata?.channels} </p>
                        </div>
                        <div>
                            <p className="font-bold">Sample Rate</p>
                            <p className="text-xs"> {metadata?.sampleRate} </p>
                        </div>
                        <div>
                            <p className="font-bold">MQS</p>
                            <p className="text-xs"> {metadata?.mqs} </p>
                        </div>
                    </div>
                </div>
            </AppForm>
        </div>
    );
}
