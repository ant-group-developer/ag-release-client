import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import LabelSelect from '@/components/ui/select/label-select';
import {
    artistList,
    genresList,
    languageList,
    yearList,
} from '@/constants/fakeData';
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
        <div className="p-4">
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
                                <Radio value="album">Album</Radio>
                                <Radio value="single">Single</Radio>
                                <Radio value="ep">EP</Radio>
                            </Radio.Group>
                        </AppFormItem>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <AppFormItem
                            label="Tên phát hành"
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
                        <AppFormItem label="Phiên bản" name="version">
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            label="Chọn nghệ sĩ chính"
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
                        <AppFormItem label="Chọn nghệ sĩ phụ" name="subArtist">
                            <Select
                                mode="multiple"
                                options={artistList}
                                showSearch
                                allowClear
                            />
                        </AppFormItem>

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
                            <Select options={genresList} />
                        </AppFormItem>

                        <AppFormItem label="Thể loại phụ" name="subGenres">
                            <Select options={genresList} />
                        </AppFormItem>

                        <AppFormItem
                            label="Ngôn ngữ metadata"
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

                        <AppFormItem label="ID danh mục" name="catalogId">
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            label="Bản quyền"
                            name="copyRight"
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

                        <AppFormItem
                            label="Bản quyền"
                            name="copyRight2"
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
