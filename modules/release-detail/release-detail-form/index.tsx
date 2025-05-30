import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import LabelSelect from '@/components/ui/select/label-select';
import { genresList, languageList, yearList } from '@/constants/fakeData';
import { RELEASES_TYPE } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Input, Radio, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function ReleaseDetailForm() {
    const [form] = useForm();
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    useEffect(() => {
        // Nếu formValues rỗng, reset form
        if (Object.keys(formValues).length === 0) {
            form.resetFields();
        } else {
            // Nếu có formValues, set vào form
            form.setFieldsValue(formValues);
        }
    }, [form, formValues]);

    // Hàm xử lý khi form thay đổi
    const handleValuesChange = (_: any, allValues: any) => {
        // Cập nhật giá trị mới vào zustand
        setFormValues(allValues);
    };

    return (
        <div className="px-4 pt-4">
            <AppForm
                form={form}
                layout="vertical"
                showSubmit={false}
                onValuesChange={handleValuesChange}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <AppFormItem
                            label="Thể loại phát hành"
                            name="type"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Radio.Group>
                                {Object.values(RELEASES_TYPE).map((type) => {
                                    return (
                                        <Radio
                                            key={type}
                                            value={type}
                                            className="capitalize"
                                        >
                                            {type}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </AppFormItem>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <AppFormItem
                            label={messages('releases.name')}
                            name="nameRelease"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <Input allowClear />
                        </AppFormItem>
                        <AppFormItem
                            label={messages('releases.version')}
                            name="version"
                        >
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            label={messages('common.artist')}
                            name="artist"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <ArtistSelect
                                // options={artistList}
                                showSearch
                                allowClear
                            />
                        </AppFormItem>
                        <AppFormItem
                            label={messages('common.subArtist')}
                            name="subArtist"
                        >
                            <ArtistSelect
                                // options={artistList}
                                showSearch
                                allowClear
                                mode="multiple"
                            />
                        </AppFormItem>

                        <AppFormItem
                            label={messages('common.genres')}
                            name="genres"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Select options={genresList} />
                        </AppFormItem>

                        <AppFormItem
                            label={messages('common.subGenres')}
                            name="subGenres"
                        >
                            <Select options={genresList} />
                        </AppFormItem>

                        <AppFormItem
                            label={messages('common.language') + ' metadata'}
                            name="language"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Select options={languageList} />
                        </AppFormItem>

                        <AppFormItem label="Label" name="label">
                            <LabelSelect />
                        </AppFormItem>

                        <AppFormItem label="UPC/EAN/JAN" name="upc">
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem label="ID category" name="catalogId">
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            label="C Line year"
                            name="copyRight"
                            required
                            tooltipInfo="Năm đầu tiên xuất bản bản phát hành này trên toàn thế giới."
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <Input
                                addonBefore={
                                    <Select
                                        defaultValue={'2026'}
                                        options={yearList}
                                    />
                                }
                            />
                        </AppFormItem>

                        <AppFormItem
                            label="P Line year"
                            name="copyRight2"
                            tooltipInfo="Năm bản ghi âm đầu tiên được phát hành trên toàn thế giới."
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <Input
                                addonBefore={
                                    <Select
                                        defaultValue={'2026'}
                                        options={yearList}
                                    />
                                }
                            />
                        </AppFormItem>
                    </div>
                </div>
            </AppForm>
        </div>
    );
}
