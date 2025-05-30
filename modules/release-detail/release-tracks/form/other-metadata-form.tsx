import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { Select } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function OtherMetadataForm({}: Props) {
    const messages = useTranslations();
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
    return (
        <div>
            <AppForm layout="vertical" showSubmit={false}>
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
                        <Select
                            options={genresList}
                            showSearch
                            allowClear
                            // placeholder={messages(
                            //     'tracks.placeholder.selectGenres'
                            // )}
                        />
                    </AppFormItem>

                    <AppFormItem label="Thể loại phụ" name="subGenres">
                        <Select
                            options={genresList}
                            showSearch
                            allowClear
                            // placeholder={messages(
                            //     'tracks.placeholder.selectSubGenres'
                            // )}
                        />
                    </AppFormItem>
                    <AppFormItem
                        label="Nội dung nhạy cảm"
                        name=""
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
                    <AppFormItem
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
            </AppForm>
        </div>
    );
}
