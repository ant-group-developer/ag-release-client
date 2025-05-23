import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { FormInstance } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

type Props = {
    form: FormInstance;
};

export default function ReleaseDetailHeader({ form }: Props) {
    const messages = useTranslations();
    const storeForm = useReleaseFormStore((state) => state.form);
    // console.log(
    //     '🚀 ~ ReleaseDetailHeader ~ storeForm:',
    //     storeForm?.getFieldsValue()
    // );
    const formValues = useReleaseFormStore((state) => state.formValues);
    // console.log('🚀 ~ ReleaseDetailHeader ~ formValues:', formValues);
    const actualForm = form || storeForm;
    const nameRelease = useWatch('nameRelease', actualForm);
    const artist = useWatch('artist', actualForm);
    const genres = useWatch('genres', actualForm);
    const language = useWatch('language', actualForm);
    const label = useWatch('label', actualForm);
    const releaseDate = useWatch('releaseDate', actualForm);

    // Sử dụng formValues từ store
    useEffect(() => {
        storeForm?.setFieldsValue(formValues);
    }, [actualForm, formValues]);

    return (
        <div>
            <AppForm form={form} layout="vertical" showSubmit={false}>
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
                                    // className="release-detail-header-upload size-20 !border-0 !p-0"
                                    className="release-detail-header-upload size-28 !rounded-lg !border-0 !p-0"
                                    accept="image/*"
                                    maxCount={1}
                                    placeholder="Kéo và thả ảnh vào đây!"
                                />
                            </AppFormItem>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm">
                                    <span>Tên phát hành: </span>
                                    <span className="font-bold">
                                        {nameRelease}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Label: </span>
                                    <span className="font-bold">{label}</span>
                                </div>
                                <div className="text-sm">
                                    <span>Nghệ sĩ: </span>
                                    <span className="font-bold">{artist}</span>
                                </div>
                                <div className="text-sm">
                                    <span>Thể loại: </span>
                                    <span className="font-bold">{genres}</span>
                                </div>
                                <div className="text-sm">
                                    <span>Ngôn ngữ: </span>
                                    <span className="font-bold">
                                        {language}
                                    </span>
                                </div>
                                {/* <div className="text-sm">
                                    <span>Ngày phát hành: </span>
                                    <span className="font-bold">
                                        {releaseDate}
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* <div>
                    <p className="pb-2 text-xs font-medium">
                        Cập nhật cuối: Nguyễn Đình Hào | 13:11 17/05/2025
                    </p>
                    <div className="flex justify-end">
                        <Radio.Group defaultValue="a">
                            <Radio.Button value="read">Đọc</Radio.Button>
                            <Radio.Button value="edit">Sửa</Radio.Button>
                        </Radio.Group>
                    </div>
                </div> */}
                </div>
            </AppForm>
        </div>
    );
}
