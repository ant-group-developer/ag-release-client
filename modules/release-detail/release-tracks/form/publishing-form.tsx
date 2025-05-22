import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { Input, Select } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';

type Props = {};

export default function PublishingForm({}: Props) {
    const messages = useTranslations();

    const [form] = useForm();
    const publishingType = useWatch('publishingType', form);
    const isPublisher = publishingType == '3';

    return (
        <div>
            <AppForm form={form} layout="vertical" showSubmit={false}>
                <div className="grid grid-cols-2 gap-4">
                    <AppFormItem
                        label="Xuất bản"
                        name="publishingType"
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
                                {
                                    label: 'Coppyright control (self-published)',
                                    value: '1',
                                },
                                {
                                    label: 'Publish domain (no published)',
                                    value: '2',
                                },
                                {
                                    label: 'Publish (managed by a publisher)',
                                    value: '3',
                                },
                            ]}
                        />
                    </AppFormItem>

                    {isPublisher && (
                        <AppFormItem
                            label="Tên xuất bản"
                            name="publisherName"
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
                                    {
                                        label: 'Publisher 1',
                                        value: '1',
                                    },
                                    {
                                        label: 'Publisher 2',
                                        value: '2',
                                    },
                                ]}
                            />
                        </AppFormItem>
                    )}

                    <AppFormItem
                        label="Vai trò"
                        name="role"
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
                                {
                                    label: 'Composer',
                                    value: '1',
                                },
                                {
                                    label: 'adaptor',
                                    value: '2',
                                },
                                {
                                    label: 'writer',
                                    value: '3',
                                },
                            ]}
                        />
                    </AppFormItem>
                    <AppFormItem
                        label="Tên nhạc sĩ (Tên hợp lệ không phải nghệ danh)"
                        name="musicianName"
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
                                {
                                    label: 'Nguyễn Văn A',
                                    value: '1',
                                },
                                {
                                    label: 'Nguyễn Văn B',
                                    value: '2',
                                },
                            ]}
                        />
                    </AppFormItem>
                    <AppFormItem
                        label="Tỷ lệ cổ phần"
                        name="label"
                        rules={[
                            {
                                pattern: /^\d+$/,
                                message: messages('validation.mustBeNumber'),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>
                </div>
            </AppForm>
        </div>
    );
}
