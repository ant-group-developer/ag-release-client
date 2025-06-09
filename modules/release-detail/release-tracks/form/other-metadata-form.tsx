import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import GenresSelect from '@/components/ui/select/genres-select';
import { languageList } from '@/constants/fakeData';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type Props = {};

export default function OtherMetadataForm({}: Props) {
    const [form] = useForm();
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);

    useEffect(() => {
        form.setFieldsValue({
            genres: formValues.genres,
            subGenres: formValues.subGenres,
            sensitiveContent: formValues.sensitiveContent,
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
                        name="sensitiveContent"
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
                                { label: 'Có', value: 'true' },
                                { label: 'Không', value: 'false' },
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
                        name="MetadataLanguage"
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
