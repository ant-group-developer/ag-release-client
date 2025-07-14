import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { DATE_FORMAT, TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { formattedDate, getImageDimensions } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { RELEASE_MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { useDeleteReleaseArtist } from '@/modules/release-artist/hooks/use-delete-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { useCreateReleaseCoverArt } from '@/modules/release-cover-art/hooks/use-create-release-cover-art';
import { ReleaseCoverArtPayload } from '@/modules/release-cover-art/types';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { CreateVariables } from '@/types/api';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
    isScrolled: boolean;
};

export default function ReleaseDetailHeader({ isScrolled }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const params = useParams();
    const isCreateReleasePage = params['action'] === 'create';

    const mainArtist = formValues?.releaseArtists?.find(
        (releaseArtist: ReleaseArtist) =>
            releaseArtist.artistRole?.name === RELEASE_MAIN_ARTIST_ROLE
    );

    const { createReleaseCoverArt } = useCreateReleaseCoverArt();
    const handleImageUpload = async (info: any) => {
        const file = info.fileList[0];
        if (!file) return;
        const fileOriginal = file.originFileObj;

        const payload: CreateBucketFile = {
            uploadPurpose: TYPE_UPLOAD_BUCKET.RELEASE_COVER_ART,
            file: {
                fileName: fileOriginal.name,
                contentType: fileOriginal.type,
                extension: fileOriginal.name.split('.').pop(),
                fileSize: fileOriginal.size,
            },
        };

        const fileId = await bucketApi.createBucket(fileOriginal, payload);
        if (fileId) {
            bucketApi.submit({ ids: [fileId] });
        }
        const { width, height } = await getImageDimensions(fileOriginal);
        const variables: CreateVariables<ReleaseCoverArtPayload> = {
            payload: {
                fileId,
                height,
                width,
                type: 'original',
                releaseId: formValues.id as string,
            },
        };

        createReleaseCoverArt(variables);
        setFormValues({
            coverArtThumbnails: {
                '75x75': formValues.coverArtThumbnails?.['75x75'] ?? null,
                '100x100': formValues.coverArtThumbnails?.['100x100'] ?? null,
                '160x160': formValues.coverArtThumbnails?.['160x160'] ?? null,
                '300x300': formValues.coverArtThumbnails?.['300x300'] ?? null,
                '900x900': formValues.coverArtThumbnails?.['900x900'] ?? null,
                original: file.url || file.thumbUrl || null,
            },
        });
    };

    const { deleteReleaseArtist } = useDeleteReleaseArtist();
    const handleRemoveImage = () => {};

    useEffect(() => {
        form.setFieldsValue({
            thumbnail: formValues.coverArtThumbnails?.original
                ? {
                      fileList: [
                          {
                              uid: formValues.id,
                              thumbUrl: formValues.coverArtThumbnails.original,
                              url: formValues.coverArtThumbnails.original,
                              name: formValues.title,
                          },
                      ],
                  }
                : undefined,
        });
    }, [formValues, form]);

    // Khi submit form thì cập nhật lại state
    // const handleFinish = (data: any) => {
    //     setFormValues({ ...formValues, ...data });
    // };

    return (
        <div>
            <AppForm
                form={form}
                // onFinish={handleFinish}
                layout="vertical"
                showSubmit={false}
            >
                <div className="flex justify-between px-4 py-2">
                    <div className="flex w-full gap-4">
                        <div>
                            <AppFormItem
                                name="thumbnail"
                                // label={messages('common.uploadImage')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.image'),
                                    },
                                ]}
                            >
                                <ImageListUpload
                                    disabled={isCreateReleasePage}
                                    className={cn(
                                        'release-detail-header-upload size-28 !rounded-lg !border-0 !p-0 transition-all duration-300'
                                        // {
                                        //     'size-14 transition-all duration-300':
                                        //         isScrolled,
                                        // }
                                    )}
                                    accept="image/*"
                                    maxCount={1}
                                    minWidth={1400}
                                    placeholder={messages('common.uploadImage')}
                                    onChange={handleImageUpload}
                                    onRemove={handleRemoveImage}
                                />
                            </AppFormItem>
                        </div>
                        <div>
                            <div
                                className={cn(
                                    'grid grid-cols-2 gap-x-8 gap-y-4',
                                    {
                                        'grid-cols-3': isScrolled,
                                    }
                                )}
                            >
                                <div className="text-sm">
                                    <span>{messages('releases.name')}: </span>
                                    <span className="font-bold">
                                        {formValues.title}{' '}
                                        {formValues.version &&
                                            formValues.title &&
                                            `[${formValues.version}]`}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Label: </span>
                                    <span className="font-bold">
                                        {formValues?.label?.name}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>{messages('artist.label')}: </span>
                                    <span className="font-bold">
                                        {mainArtist?.artist?.name}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>{messages('common.genres')}: </span>
                                    <span className="font-bold">
                                        {formValues?.primaryGenre?.name}
                                    </span>
                                </div>
                                {formValues.releaseDate && (
                                    <div>
                                        <span>
                                            {messages('common.releaseDate')}
                                            :{' '}
                                        </span>
                                        <span className="font-bold">
                                            {formattedDate(
                                                formValues.releaseDate,
                                                DATE_FORMAT.DATE_ONLY
                                            )}
                                        </span>
                                    </div>
                                )}

                                {formValues.upc && (
                                    <div>
                                        <span>UPC: </span>
                                        <span className="font-bold">
                                            {formValues.upc}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AppForm>
        </div>
    );
}
