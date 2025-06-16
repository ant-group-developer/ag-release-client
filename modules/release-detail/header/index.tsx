import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { cn } from '@/helpers/tailwind';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type Props = {
    isScrolled: boolean;
};

export default function ReleaseDetailHeader({ isScrolled }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const mainArtist = formValues?.artists?.find(
        (artist: any) => artist.role === 'Main Artist'
    );

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
                            >
                                <ImageListUpload
                                    className={cn(
                                        'release-detail-header-upload size-28 !rounded-lg !border-0 !p-0 transition-all duration-300',
                                        {
                                            'size-12 transition-all duration-300':
                                                isScrolled,
                                        }
                                    )}
                                    accept="image/*"
                                    maxCount={1}
                                    placeholder="Tải ảnh lên"
                                />
                            </AppFormItem>
                        </div>
                        <div className="">
                            <div
                                className={cn('grid grid-cols-2 gap-2', {
                                    'grid-cols-3': isScrolled,
                                })}
                            >
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
                                        {formValues?.artists
                                            ? mainArtist?.name
                                            : ''}
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
                                        {formValues.metaDataLanguage}
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
