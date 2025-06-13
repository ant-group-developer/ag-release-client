import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import GenresSelect from '@/components/ui/select/genres-select';
import { languageList } from '@/constants/fakeData';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type Props = {
    checkTrackValid: (boolean: boolean) => void;
    trackData: TrackData;
};

export default function OtherMetadataForm({
    checkTrackValid,
    trackData,
}: Props) {
    const [form] = useForm();
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const handleValuesChange = (changedValues: any) => {
        setTimeout(() => {
            form.validateFields()
                .then((values) => {
                    checkTrackValid(true);
                    const newValue = {
                        ...formValues,
                        tracks: formValues?.tracks?.map((track: any) => {
                            if (track.id === trackData.id) {
                                return {
                                    ...track,
                                    ...changedValues,
                                };
                            }
                            return track;
                        }),
                    };
                    setFormValues(newValue);
                })
                .catch((error) => {
                    console.log('other invalid', error);
                    checkTrackValid(false);
                });
        }, 0);
    };

    useEffect(() => {
        form.setFieldsValue({
            ...formValues?.tracks?.find(
                (track: TrackData) => track.id === trackData.id
            ),
            genres: formValues.genres,
            subGenres: formValues.subGenres,
        });

        form.validateFields()
            .then((values) => {
                console.log('other valid');
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
                onValuesChange={(changedValues) =>
                    handleValuesChange(changedValues)
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <AppFormItem
                        label="Thể loại"
                        name="genres"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <GenresSelect
                            showSearch
                            allowClear
                            // placeholder={messages(
                            //     'tracks.placeholder.selectGenres'
                            // )}
                        />
                    </AppFormItem>

                    <AppFormItem label="Thể loại phụ" name="subGenres">
                        <GenresSelect
                            showSearch
                            allowClear
                            // placeholder={messages(
                            //     'tracks.placeholder.selectSubGenres'
                            // )}
                        />
                    </AppFormItem>
                    <AppFormItem
                        label="Nội dung nhạy cảm"
                        name="isSensitiveContent"
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
                            options={[
                                { label: 'Có', value: true },
                                { label: 'Không', value: false },
                            ]}
                            allowClear
                            // placeholder={messages(
                            //     'tracks.placeholder.selectSensitiveContent'
                            // )}
                        />
                    </AppFormItem>
                    {/* <AppFormItem
                        label="Ngôn ngữ bài hát"
                        name="language1"
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
                    </AppFormItem> */}
                    <AppFormItem
                        label="Ngôn ngữ quốc gia"
                        name="countryLanguage"
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
                        name="metadataLanguage"
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
                    {/* <AppFormItem
                        label="Nguồn gốc"
                        name="originalSource"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            className="w-full"
                            placeholder="Chọn nguồn gốc"
                            options={originalSourceList}
                        />
                    </AppFormItem> */}
                    <AppFormItem label="Lời bài hát" name="lyrics">
                        <TextArea
                            className="w-full"
                            placeholder="Nhập lời bài hát"
                            rows={1}
                            autoSize={{ minRows: 1, maxRows: 20 }}
                        />
                    </AppFormItem>
                </div>
            </AppForm>
        </div>
    );
}
