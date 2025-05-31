import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageFallback from '@/components/ui/image/image-fallback';
import LabelSelect from '@/components/ui/select/label-select';
import { genresList, languageList, yearList } from '@/constants/fakeData';
import { RELEASES_TYPE } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Button, Input, Radio, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function ReleaseDetailForm() {
    const [form] = useForm();
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    useEffect(() => {
        // Nếu formValues rỗng, reset form với giá trị mặc định
        if (Object.keys(formValues).length === 0) {
            form.resetFields();
            form.setFieldsValue({
                contributors: [{ role: undefined, artist: undefined }],
            });
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

    const handleAddContributor = () => {
        const contributors = form.getFieldValue('contributors') || [];
        form.setFieldsValue({
            contributors: [
                ...contributors,
                { role: undefined, artist: undefined },
            ],
        });
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

                        {/* <div className="col-span-2">
                            <DynamicFieldContributor />
                        </div> */}

                        <div className="col-span-2">
                            <AppFormItem
                                label="Artists and Contributors"
                                name="contributors"
                            >
                                <div>
                                    <Button shape="round" className="mb-4">
                                        Thêm nghệ sĩ chính
                                    </Button>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Array.from({ length: 3 }).map(
                                            (_, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 rounded-lg bg-gray-100 px-3 py-2"
                                                >
                                                    <div>
                                                        <ImageFallback
                                                            src="https://placehold.co/100x100"
                                                            alt="artist"
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">
                                                            Ant group
                                                        </p>
                                                        <p>
                                                            <span>
                                                                1569468 |
                                                            </span>
                                                            <span>
                                                                Main Artist
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </AppFormItem>
                        </div>

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
