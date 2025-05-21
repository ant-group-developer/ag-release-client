import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { FormInstance } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';

type Props = {
    form: FormInstance;
};

export default function ReleaseDetailHeader({ form }: Props) {
    const messages = useTranslations();
    const nameRelease = useWatch('nameRelease', form);
    const artist = useWatch('artist', form);
    const genres = useWatch('genres', form);
    const language = useWatch('language', form);
    const label = useWatch('label', form);
    const releaseDate = useWatch('releaseDate', form);

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
                                    className="release-detail-header-upload"
                                    accept="image/*"
                                    maxCount={1}
                                    placeholder="Kéo và thả ảnh vào đây!"
                                />
                            </AppFormItem>
                        </div>
                        <div className="">
                            <div className="full grid grid-cols-1 gap-4">
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
