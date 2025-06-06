import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import CountrySelect from '@/components/ui/select/country-select';
import { languageList } from '@/constants/fakeData';
import extractAudioMetadata from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Input, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props = {
    trackData: TrackData;
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

export default function AudioSpecifications({ trackData }: Props) {
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
    useEffect(() => {
        form.setFieldsValue({
            ...formValues,
            trackName: file.name,
        });
        getMetadata().then((metadata) => {
            setMetadata(metadata);
        });
    }, [formValues, form]);

    return (
        <div>
            <AppForm
                form={form}
                initialValues={formValues}
                layout="vertical"
                showSubmit={false}
            >
                <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <AppFormItem
                            label="Tên File"
                            name="trackName"
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

                        <AppFormItem
                            label="WMG Registered Filename"
                            name="registeredFilename"
                        >
                            <Input />
                        </AppFormItem>
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
                        <AppFormItem
                            label="Đoạn nghe trước"
                            name="previewTrack"
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
                        <AppFormItem
                            label="Ngôn ngữ quốc gia"
                            name="language2"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                options={languageList}
                                allowClear
                                // placeholder={messages(
                                //     'tracks.placeholder.selectLanguage'
                                // )}
                            />
                        </AppFormItem>
                        <AppFormItem
                            label="Ngôn ngữ metadata"
                            name="language3"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                options={languageList}
                                allowClear
                                // placeholder={messages(
                                //     'tracks.placeholder.selectLanguage'
                                // )}
                            />
                        </AppFormItem>
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
