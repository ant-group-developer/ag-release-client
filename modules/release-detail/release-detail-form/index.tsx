import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { FormInstance, Input, Radio, Select } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance;
};

export default function ReleaseDetailForm({ form }: Props) {
    const messages = useTranslations();
    const artistList = [
        {
            label: 'Nghệ sĩ 1',
            value: 'artist-1',
        },
        {
            label: 'Nghệ sĩ 2',
            value: 'artist-2',
        },
    ];

    const genresList = [
        {
            label: 'Hip-Hop',
            value: 'genre-1',
        },
        {
            label: 'Rap',
            value: 'genre-2',
        },
    ];

    const languageList = [
        {
            label: 'Tiếng Việt',
            value: 'vi',
        },
        {
            label: 'Tiếng Anh',
            value: 'en',
        },
    ];

    const labelList = [
        {
            label: 'Hãng thu âm 1',
            value: 'label-1',
        },
        {
            label: 'Hãng thu âm 2',
            value: 'label-2',
        },
    ];

    const yearList = [
        {
            label: '2026',
            value: '2026',
        },
        {
            label: '2025',
            value: '2020',
        },
        {
            label: '2024',
            value: '2021',
        },
    ];

    return (
        <div className="px-4 py-4">
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
                            label="Ngôn ngữ"
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
                            name="coppyRight"
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
                            name="coppyRight2"
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
