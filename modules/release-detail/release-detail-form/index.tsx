import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import {
    artistList,
    genresList,
    labelList,
    languageList,
    yearList,
} from '@/constants/fakeData';
import { FormInstance, Input, Radio, Select } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance;
};

export default function ReleaseDetailForm({ form }: Props) {
    const messages = useTranslations();

    return (
        <div className="px-40 py-4">
            <AppForm form={form} layout="vertical" showSubmit={false}>
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
                        <AppFormItem
                            label="Tên hiển thị"
                            name="nameDisplay"
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
                            <Select
                                options={artistList}
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
                            <Select options={labelList} />
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
