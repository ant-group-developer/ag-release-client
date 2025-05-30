import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import PlatformSelect from '@/components/ui/select/platform-select';
import RegionSelect from '@/components/ui/select/region-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DatePicker, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props = {};

export default function ReleaseSchedulingForm({}: Props) {
    const messages = useTranslations();

    const [form] = Form.useForm();
    const territoryType = Form.useWatch('territoryType', form);
    const platformType = Form.useWatch('platformType', form);

    const [releaseSchedulingData, setReleaseSchedulingData] = useState([
        {
            key: '1',
            territory: 'Worldwide',
            territoryType: 'Worldwide',
            platform: 'ALL',
            platformType: 'ALL',
            track: 'Dreamscape',
            releaseDate: '2025-05-30',
            preOrderDate: '2025-05-25',
            originalReleaseDate: '2025-05-20',
            pd: 'Yes',
            etu: 'Yes',
            adSs: 'Yes',
            ugc: 'Monetize',
        },
        {
            key: '2',
            territory: 'Worldwide',
            exclusivity: 'Exclusive',
            track: 'Lullaby',
            releaseDate: '2025-05-30',
            preOrderDate: '2025-05-25',
            instGratDate: '2025-05-27',
            pd: 'Yes',
            etu: 'Yes',
            adSs: 'Yes',
            ugc: 'Monetize',
        },
        {
            key: '3',
            territory: 'Worldwide',
            exclusivity: 'Exclusive',
            track: 'Serenity',
            releaseDate: '2025-05-30',
            preOrderDate: '2025-05-25',
            instGratDate: null, // không có IG Date
            pd: 'Yes',
            etu: 'Yes',
            adSs: 'Yes',
            ugc: 'Monetize',
        },
        {
            key: '4',
            territory: 'Worldwide',
            exclusivity: 'Exclusive',
            track: 'Awakening',
            releaseDate: '2025-05-30',
            preOrderDate: '2025-05-25',
            instGratDate: '2025-05-28',
            pd: 'Yes',
            etu: 'Yes',
            adSs: 'Yes',
            ugc: 'Monetize',
        },
        {
            key: '5',
            territory: 'Worldwide',
            exclusivity: 'Exclusive',
            track: 'Echoes',
            releaseDate: '2025-05-30',
            preOrderDate: '2025-05-25',
            instGratDate: '2025-05-29',
            pd: 'Yes',
            etu: 'Yes',
            adSs: 'Yes',
            ugc: 'Monetize',
        },
    ]);

    useEffect(() => {
        if (territoryType === 'Worldwide') {
            form.setFieldValue('territory', undefined);
        }
    }, [territoryType, form]);

    const handleSubmit = (values: any) => {
        const newSchedule = {
            key: String(releaseSchedulingData.length + 1),
            ...values,
            pd: values.pd ? 'Yes' : 'No',
            etu: values.etu ? 'Yes' : 'No',
            adSs: values.adSs ? 'Yes' : 'No',
        };

        setReleaseSchedulingData([...releaseSchedulingData, newSchedule]);
        form.resetFields();
    };
    return (
        <div className="rounded-lg bg-white p-4">
            <AppForm
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                showSubmit={false}
            >
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-8">
                        <AppFormItem
                            label="Ngày phát hành sản phẩm"
                            name="releaseDate"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <DatePicker
                                className="w-full"
                                format="YYYY-MM-DD"
                            />
                        </AppFormItem>

                        <AppFormItem
                            label="Ngày đặt trước sản phẩm"
                            name="preOrderDate"
                        >
                            <DatePicker
                                className="w-full"
                                format="YYYY-MM-DD"
                            />
                        </AppFormItem>

                        <AppFormItem
                            label="Ngày phát hành ban đầu"
                            name="originalReleaseDate"
                        >
                            <DatePicker
                                className="w-full"
                                format="YYYY-MM-DD"
                            />
                        </AppFormItem>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <AppFormItem
                            label="Loại khu vực"
                            name="territoryType"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <RegionSelect
                                multiple
                                allowClear
                                maxTagCount="responsive"
                                maxTagPlaceholder={(value) => (
                                    <CustomTooltip
                                        title={value
                                            .map((item: any) => item.label)
                                            .join(', ')}
                                    >
                                        +{value.length}
                                    </CustomTooltip>
                                )}
                            />
                        </AppFormItem>

                        <AppFormItem
                            label="Loại nền tảng"
                            name="platformType"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <PlatformSelect
                                className="w-full"
                                placeholder="Chọn nền tảng"
                                mode="multiple"
                                allowClear
                                maxTagCount="responsive"
                                maxTagPlaceholder={(value) => (
                                    <CustomTooltip
                                        title={value
                                            .map((item: any) => item.label)
                                            .join(', ')}
                                    >
                                        +{value.length}
                                    </CustomTooltip>
                                )}
                            />
                        </AppFormItem>

                        <AppFormItem
                            label="Timezone"
                            name="timezone"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <TimezoneSelect className="w-full" />
                        </AppFormItem>
                    </div>

                    {/* <AppFormItem
                label="UGC"
                name="ugc"
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
                            label: 'Monetize',
                            value: 'Monetize',
                        },
                        { label: 'Block', value: 'Block' },
                        { label: 'Track', value: 'Track' },
                    ]}
                    placeholder="Chọn UGC"
                />
            </AppFormItem> */}
                </div>
            </AppForm>
        </div>
    );
}
