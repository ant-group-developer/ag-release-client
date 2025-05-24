import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function ReleaseDetailHeader() {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const handleValuesChange = (_: any, allValues: any) => {
        setFormValues({ ...formValues, ...allValues });
    };

    useEffect(() => {
        if (Object.keys(formValues).length > 0) {
            form.setFieldsValue(formValues);
        }
    }, [form, formValues]);

    return (
        <div>
            <AppForm
                form={form}
                layout="vertical"
                showSubmit={false}
                onValuesChange={handleValuesChange}
                // initialValues={formValues}
            >
                <div className="flex justify-between px-4 py-2">
                    <div className="flex w-full gap-4">
                        <div>
                            <AppFormItem
                                name="thumbnail"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.image'),
                                    },
                                ]}
                                initialValue={formValues.thumbnail}
                            >
                                <ImageListUpload
                                    className="release-detail-header-upload size-28 !rounded-lg !border-0 !p-0"
                                    accept="image/*"
                                    maxCount={1}
                                    placeholder="Tải ảnh lên"
                                    defaultFileList={
                                        formValues.thumbnail?.fileList
                                    }
                                />
                            </AppFormItem>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm">
                                    <span>Tên phát hành: </span>
                                    <span className="font-bold">
                                        {formValues.nameRelease}{' '}
                                        {formValues.version &&
                                            formValues.nameRelease &&
                                            `[${formValues.version}]`}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Label: </span>
                                    <span className="font-bold">
                                        {formValues.label}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Nghệ sĩ: </span>
                                    <span className="font-bold">
                                        {formValues.artist}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Thể loại: </span>
                                    <span className="font-bold">
                                        {formValues.genres}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Ngôn ngữ: </span>
                                    <span className="font-bold">
                                        {formValues.language}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppForm>
        </div>
    );
}
