import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT, TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { cn } from '@/helpers/tailwind';
import {
    FEATURING_ARTIST_ROLE,
    MAIN_ARTIST_ROLE,
} from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { UpdateVariables } from '@/types/api';
import { Form, Segmented, theme } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
    isScrolled: boolean;
};

export default function ReleaseDetailHeader({ isScrolled }: Props) {
    // hooks - state
    const messages = useTranslations();
    const [form] = Form.useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const params = useParams();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { token } = theme.useToken();
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );
    const setReleaseDetailAction = useReleaseDetailActionStore(
        (state) => state.setAction
    );

    // apis
    const { updateReleaseDraft, isPending: isUpdatingRelease } =
        useUpdateReleaseDraft();
    const coverArtFileId = formValues?.coverArtThumbnails?.['160x160'] ?? '';
    const { linkReadFile } = useGetLinkReadFile(coverArtFileId);
    const { releaseData } = useGetDetailRelease(formValues?.id as string);

    // const
    const isVariousArtist = !!formValues?.isVariousArtist;
    const isCreateReleasePage = params['action'] === 'create';
    const mainArtist = formValues?.releaseArtists?.find(
        (releaseArtist: ReleaseArtist) =>
            releaseArtist.artistRole?.code === MAIN_ARTIST_ROLE
    );
    const featuringArtistNames = formValues?.releaseArtists
        ?.map((item: ReleaseArtist) => {
            if (item?.artistRole?.code == FEATURING_ARTIST_ROLE) {
                return item?.artist?.name;
            }
        })
        .filter(Boolean)
        .join(', ');

    const renderArtistName = () => {
        if (isVariousArtist) {
            return messages('artist.variousArtists');
        } else if (mainArtist) {
            return `${mainArtist?.artist?.name} ${featuringArtistNames && featuringArtistNames?.length > 0 ? `(feat. ${featuringArtistNames})` : ''}`;
        }
        return '';
    };

    const segmentedOptions: SegmentedOptions = [
        {
            label: messages('common.watch'),
            value: RELEASE_DETAIL_ACTION.READ,
        },
        {
            label: messages('common.edit'),
            value: RELEASE_DETAIL_ACTION.EDIT,
        },
    ];
    const isReadMode = releaseDetailAction === RELEASE_DETAIL_ACTION.READ;

    // func
    const handleImageUpload = async (info: any) => {
        setIsUploading(true);
        const file = info.fileList[0];
        if (!file) {
            return;
        }
        const fileOriginal = file.originFileObj;
        // const fileNameWithoutExtension =
        //     fileOriginal.name.lastIndexOf('.') !== -1
        //         ? fileOriginal.name.substring(
        //               0,
        //               fileOriginal.name.lastIndexOf('.')
        //           )
        //         : fileOriginal.name;

        if (fileOriginal.name.length > 80) {
            setIsUploading(false);
            form.setFieldsValue({
                thumbnail: undefined,
            });
            return showNotification(
                'error',
                messages('validation.max', { number: 80 })
            );
        }

        const payload: CreateBucketFile = {
            folderBucket: {
                releaseId: formValues.id ?? '',
                uploadPurpose: TYPE_UPLOAD_BUCKET.RELEASE_COVER_ART,
            },
            file: {
                fileName: fileOriginal.name,
                contentType: fileOriginal.type,
                extension: fileOriginal.name.split('.').pop(),
                fileSize: fileOriginal.size,
            },
        };

        const fileId = await bucketApi.createBucket(fileOriginal, payload);
        if (fileId) {
            await bucketApi.submit({ ids: [fileId] });
        }
        const variables: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseDraftPayload
        > = {
            id: formValues.id as string,
            payload: {
                releaseCoverArt: {
                    fileId,
                },
            },
            onSuccess: (data: ReleasesData) => {
                setIsUploading(false);
                // setFormValues({ coverArtThumbnails: data?.coverArtThumbnails });
            },
            onError: () => {
                setIsUploading(false);
            },
        };

        updateReleaseDraft(variables);
    };
    const handleRemoveImage = () => {
        setIsConfirmOpen(true);
        return false;
    };
    const handleConfirmRemove = async () => {
        const variables: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseDraftPayload
        > = {
            id: formValues.id as string,
            payload: {
                releaseCoverArt: null,
            },
            onSuccess: () => {
                setIsConfirmOpen(false);
                setFormValues({
                    coverArtThumbnails: {
                        '75x75': null,
                        '100x100': null,
                        '160x160': null,
                        '300x300': null,
                        '900x900': null,
                        original: null,
                    },
                });
                form.setFieldsValue({
                    thumbnail: undefined,
                });
            },
            onError: () => {
                setIsConfirmOpen(false);
            },
        };
        updateReleaseDraft(variables);
    };

    useEffect(() => {
        form.setFieldsValue({
            thumbnail:
                formValues.coverArtThumbnails?.['160x160'] && linkReadFile
                    ? {
                          fileList: [
                              {
                                  uid: formValues.coverArtThumbnails['160x160'],
                                  url: linkReadFile,
                                  name: formValues.title,
                              },
                          ],
                      }
                    : undefined,
        });
    }, [formValues, form, linkReadFile]);

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <AppForm
                form={form}
                // onFinish={handleFinish}
                layout="vertical"
                showSubmit={false}
            >
                <div className="flex justify-between py-2">
                    <div className="flex w-full items-start gap-4">
                        <CustomTooltip
                            title={
                                <>
                                    <div>
                                        {messages('releases.coverArt.required')}
                                    </div>
                                    <div>
                                        - {messages('releases.coverArt.size')}
                                    </div>
                                    <div>
                                        -{' '}
                                        {messages(
                                            'image.validation.mustBeLessThanMB',
                                            { value: 10 }
                                        )}
                                    </div>
                                </>
                            }
                            placement="right"
                            overlayInnerStyle={{ minWidth: '300px' }}
                        >
                            <AppFormItem name="thumbnail">
                                <ImageListUpload
                                    id="releaseCoverArts"
                                    loading={isUploading}
                                    disabled={isCreateReleasePage || isReadMode}
                                    className={cn(
                                        'release-detail-header-upload !aspect-square !size-28 !rounded-lg !border-0 !p-0 transition-all duration-300',
                                        {
                                            '!size-16 transition-all duration-300':
                                                isScrolled,
                                        }
                                    )}
                                    accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                                    maxCount={1}
                                    minWidth={1400}
                                    maxSizeMB={10}
                                    placeholder={messages('common.uploadImage')}
                                    onChange={handleImageUpload}
                                    onRemove={handleRemoveImage}
                                />
                            </AppFormItem>
                        </CustomTooltip>
                        <div>
                            <div
                                className={cn(
                                    'flex flex-col flex-wrap content-start gap-x-8 gap-y-2',
                                    {
                                        'h-16': isScrolled,
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
                                {formValues.labelId && (
                                    <div className="text-sm">
                                        <span>Label: </span>
                                        <span className="font-bold">
                                            {formValues?.label?.name}
                                        </span>
                                    </div>
                                )}
                                <div className="text-sm">
                                    <span>{messages('artist.label')}: </span>
                                    <span className="font-bold">
                                        {renderArtistName()}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>{messages('common.genres')}: </span>
                                    <span className="font-bold">
                                        {formValues?.primaryGenre?.name}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        {messages('common.releaseDate')}:{' '}
                                    </span>
                                    <span className="font-bold">
                                        {formattedDate(
                                            formValues.releaseDate,
                                            DATE_FORMAT.DATE_ONLY
                                        )}
                                    </span>
                                </div>

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
                    {!isCreateReleasePage && (
                        <div className="space-y-1">
                            <p className="text-nowrap text-xs text-gray-500">
                                {messages('common.lastEdit')}:{' '}
                                {releaseData?.modifier?.name} |{' '}
                                {formattedDate(releaseData?.updatedAt)}
                            </p>
                            <div className="flex justify-end">
                                <Segmented
                                    value={releaseDetailAction}
                                    options={segmentedOptions}
                                    onChange={(e) =>
                                        setReleaseDetailAction(
                                            e as RELEASE_DETAIL_ACTION
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </AppForm>
            <AppConfirm
                open={isConfirmOpen}
                modalTitle={messages('delete.confirmTitle')}
                paragraph={messages('delete.confirmMessage', {
                    value: messages('common.image').toLowerCase(),
                })}
                onCancel={() => setIsConfirmOpen(false)}
                onOk={handleConfirmRemove}
            />
        </div>
    );
}
