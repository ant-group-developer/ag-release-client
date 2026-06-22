import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate } from '@/helpers/common';
import { toastPromise } from '@/helpers/messages-helper';
import { cn } from '@/helpers/tailwind';
import { useHash } from '@/hooks/use-hash';
import { LoadingType, useLoading, waitForLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useDistributeRelease } from '@/modules/distribution/hooks/use-distribute';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { DistributeRelease } from '@/modules/distribution/types/payload';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import {
    RELEASE_ROUTE_ACTION,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import {
    convertTiffToPreviewUrl,
    isTiffContent,
    resolvePreviewUrl,
} from '@/modules/releases/helpers/cover-art-preview';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { DeleteVariables, UpdateVariables } from '@/types/api';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Form,
    Space,
    Tag,
    Typography,
    notification,
    theme,
} from 'antd';
import exifr from 'exifr';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReleaseStatusTag from '../../tag/release-status-tag';
import DownloadMenu from './download-menu';
import ReleaseInfoV2 from './release-info-v2';
type Props = {
    isScrolled: boolean;
};

export default function ReleaseDetailHeader({ isScrolled }: Props) {
    // hooks - state
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const selectedRows = useReleaseDistribute((state) => state.selectedRows);

    const messages = useTranslations();
    const queryClient = useQueryClient();
    const isAnyMutating = useLoading(LoadingType.Mutating);
    const [form] = Form.useForm();
    const [notificationApi, contextHolder] = notification.useNotification();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const params = useParams();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [coverArtPreviewUrl, setCoverArtPreviewUrl] = useState('');
    const localPreviewUrlRef = useRef<string | null>(null);
    const { token } = theme.useToken();
    const router = useRouter();
    const releaseAction = useReleaseActionStore((state) => state.action);
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);

    // apis
    const { updateReleaseDraft, isPending: isUpdatingRelease } =
        useUpdateReleaseDraft();
    const coverArtFileId =
        formValues?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S300] ??
        formValues?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL] ?? '';
    const { linkReadFile, isFetching: isCoverArtLoading } =
        useGetLinkReadFile(coverArtFileId);

    const originalFileId =
        formValues?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL] ?? '';
    const { linkReadFile: originalLinkReadFile } = useGetLinkReadFile(originalFileId, {
        enabled: !!originalFileId && originalFileId !== coverArtFileId,
    });
    const { releaseData } = useGetDetailRelease(formValues?.id as string);
    const { deleteRelease } = useDeleteRelease();
    const { releaseValidateData } = useReleaseValidate(
        formValues?.id as string
    );
    const { distributeRelease, isPending: isDistributingRelease } =
        useDistributeRelease();

    // const
    const isCreateReleasePage =
        params['action'] === RELEASE_ROUTE_ACTION.CREATE;


    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;
    const validateLength = releaseValidateData && releaseValidateData?.length;
    const coverArtRequirementKeys = [
        'release.coverArt.size',
        'release.coverArt.resolution',
        'release.coverArt.format',
        'release.coverArt.layered',
    ] as const;
    const coverArtRequirements = [
        ...coverArtRequirementKeys.map((key) => messages(key)),
        messages('image.validation.mustBeLessThanMB', { value: 10 }),
    ];

    // func
    async function validateCoverArt(file: File): Promise<string[]> {
        const errorKeys: string[] = [];

        if (file.name.length > 80) {
            errorKeys.push('validation.fileNameTooLong');
        }

        if (file.size > 10 * 1024 * 1024) {
            errorKeys.push('image.validation.mustBeLessThanMB');
        }

        try {
            const exifData = await exifr.parse(file, {
                exif: true,
                icc: true,
            });

            const width = exifData?.ImageWidth;
            const height = exifData?.ImageHeight;

            if (width !== height || width < 1400 || width > 4000) {
                errorKeys.push('release.coverArt.size');
            }

            const dpiX = exifData?.XResolution;
            const dpiY = exifData?.YResolution;
            if (!dpiX || !dpiY || dpiX < 300 || dpiY < 300) {
                errorKeys.push('release.coverArt.resolution');
            }

            // CMYK check
            const iccColorSpace =
                exifData?.ColorSpaceData?.trim().toLowerCase();
            if (iccColorSpace === 'cmyk') {
                errorKeys.push('release.coverArt.format');
            }
        } catch (error) {
            console.error('Validation error:', error);
        }

        return errorKeys;
    }

    const resolvePreviewFromFile = async (file: File) => {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer.slice(0, 4));

        if (isTiffContent(file.type, bytes)) {
            return {
                previewUrl: await convertTiffToPreviewUrl(buffer),
                revokeUrl: false,
            };
        }

        return {
            previewUrl: URL.createObjectURL(file),
            revokeUrl: true,
        };
    };

    const handleImageUpload = async (info: any) => {
        setIsUploading(true);
        const file = info.fileList[0];
        if (!file) {
            return;
        }
        const fileOriginal = file.originFileObj;
        const showError = (errorKeys: string[]) => {
            setIsUploading(false);
            form.setFieldsValue({
                thumbnail: undefined,
            });

            const currentErrors = errorKeys.map((errorKey) =>
                errorKey === 'image.validation.mustBeLessThanMB'
                    ? messages(errorKey, { value: 10 })
                    : messages(errorKey as any)
            );

            return notificationApi.open({
                key: 'release-cover-art-error',
                placement: 'top',
                duration: 4,
                type: 'error',
                message: (
                    <Typography className="!text-lg font-semibold">
                        {messages('common.uploadError')}
                    </Typography>
                ),
                description: (
                    <Space direction="vertical">
                        <Typography className="text-base font-medium leading-6">
                            {currentErrors.join(', ')}
                        </Typography>
                        <Typography className="text-base font-semibold">
                            {messages('release.coverArt.requirements')}
                        </Typography>
                        <ul className="list-disc px-4">
                            {coverArtRequirements.map((requirement) => (
                                <li key={requirement}>{requirement}</li>
                            ))}
                        </ul>
                    </Space>
                ),
                style: {
                    width: 500,
                },
            });
        };

        const validationErrors = await validateCoverArt(fileOriginal);
        if (validationErrors.length > 0) {
            return showError(validationErrors);
        }

        try {
            const { previewUrl, revokeUrl } =
                await resolvePreviewFromFile(fileOriginal);

            if (localPreviewUrlRef.current) {
                URL.revokeObjectURL(localPreviewUrlRef.current);
                localPreviewUrlRef.current = null;
            }

            if (revokeUrl) {
                localPreviewUrlRef.current = previewUrl;
            }

            const updatedFileList = info.fileList.map((item: any) =>
                item.uid === file.uid
                    ? {
                          ...item,
                          status: 'done',
                          url: previewUrl,
                          thumbUrl: previewUrl,
                          preview: previewUrl,
                          originFileObj: fileOriginal,
                          name: fileOriginal.name,
                      }
                    : item
            );

            setCoverArtPreviewUrl(previewUrl);
            form.setFieldsValue({
                thumbnail: {
                    ...info,
                    fileList: updatedFileList,
                },
            });
        } catch (error) {
            console.error('Local preview conversion error:', error);
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
                        [RELEASE_COVER_ART_SIZE.S75]: null,
                        [RELEASE_COVER_ART_SIZE.S100]: null,
                        [RELEASE_COVER_ART_SIZE.S160]: null,
                        [RELEASE_COVER_ART_SIZE.S300]: null,
                        [RELEASE_COVER_ART_SIZE.S900]: null,
                        [RELEASE_COVER_ART_SIZE.ORIGINAL]: null,
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
    const handleChangeAction = (value: RELEASE_DETAIL_ACTION) => {
        // const params = new URLSearchParams(searchParams.toString());
        // params.set('action', value);
        // router.push(`${pathname}?${params.toString()}`);
        setReleaseAction(value);
    };
    const handleDeleteRelease = () => {
        const variables: DeleteVariables<ReleasesData['id']> = {
            id: releaseData?.id,
            onSuccess: () => {
                closeModal();
                router.push(APP_ROUTES.RELEASES);
            },
        };
        deleteRelease(variables);
    };
    const handleDistribution = async () => {
        closeModal();

        // Đợi cho đến khi các mutation đang active hoàn thành mới xử lý tiếp
        await waitForLoading(queryClient, LoadingType.Mutating);

        const dspCode = selectedRows.map((row) => row.dsp.code);

        const variables: DistributeRelease = {
            id: formValues?.id ?? '',
            code: dspCode,
            onSuccess(e) {
                setReleaseAction(RELEASE_DETAIL_ACTION.READ);
                router.push(APP_ROUTES.RELEASES);
            },
        };
        const promise = distributeRelease(variables);
        toastPromise(promise, messages);
    };

    const handleGetPreviewUrl = async (file: any) => {
        if (file.originFileObj) {
            const { previewUrl } = await resolvePreviewFromFile(file.originFileObj);
            return previewUrl;
        }

        let originalLink = originalLinkReadFile;

        if (!originalLink) {
            const originalFileId =
                formValues?.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.ORIGINAL];
            if (originalFileId) {
                if (originalFileId === coverArtFileId) {
                    originalLink = linkReadFile;
                } else {
                    const response = await bucketApi.getLinkReadFile(originalFileId);
                    originalLink = (response?.data?.data as string) ?? '';
                }
            }
        }

        if (!originalLink) {
            return '';
        }

        const { previewUrl } = await resolvePreviewUrl(originalLink);
        return previewUrl;
    };

    useEffect(() => {
        let isMounted = true;
        let objectUrlToRevoke: string | null = null;

        const updatePreviewUrl = async () => {
            if (!linkReadFile) {
                setCoverArtPreviewUrl('');
                return;
            }

            try {
                const { previewUrl, revokeUrl } =
                    await resolvePreviewUrl(linkReadFile);
                if (localPreviewUrlRef.current) {
                    URL.revokeObjectURL(localPreviewUrlRef.current);
                    localPreviewUrlRef.current = null;
                }
                if (revokeUrl) {
                    objectUrlToRevoke = previewUrl;
                }
                if (isMounted) {
                    setCoverArtPreviewUrl(previewUrl);
                }
            } catch (error) {
                console.error('TIFF preview conversion error:', error);
                if (isMounted) {
                    setCoverArtPreviewUrl(linkReadFile);
                }
            }
        };

        updatePreviewUrl();

        return () => {
            isMounted = false;
            if (objectUrlToRevoke) {
                URL.revokeObjectURL(objectUrlToRevoke);
            }
        };
    }, [linkReadFile]);

    useEffect(() => {
        return () => {
            if (localPreviewUrlRef.current) {
                URL.revokeObjectURL(localPreviewUrlRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const currentThumbnail = form.getFieldValue('thumbnail');
        if (!formValues.coverArtThumbnails?.[RELEASE_COVER_ART_SIZE.S160]) {
            if (currentThumbnail?.fileList?.length) {
                return;
            }

            form.setFieldsValue({
                thumbnail: undefined,
            });
            return;
        }

        form.setFieldsValue({
            thumbnail: coverArtPreviewUrl
                ? {
                      fileList: [
                          {
                              uid: formValues.coverArtThumbnails[
                                  RELEASE_COVER_ART_SIZE.S160
                              ],
                              url: coverArtPreviewUrl,
                              name: formValues.title,
                          },
                      ],
                  }
                : undefined,
        });
    }, [formValues, form, coverArtPreviewUrl]);

    const hash = useHash();
    const hasCoverArtError = useMemo(() => {
        return hash === '#releaseCoverArts';
    }, [hash]);

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            {contextHolder}
            {!isCreateReleasePage && (
                <div
                    className="flex items-center justify-between overflow-hidden px-6 transition-all duration-300"
                    style={{
                        maxHeight: isScrolled ? 0 : 100,
                        opacity: isScrolled ? 0 : 1,
                        paddingLeft: 0,
                        paddingRight: 0,
                        paddingTop: isScrolled ? 0 : 8,
                        paddingBottom: isScrolled ? 0 : 24,
                    }}
                >
                    {/* <Steps
                        className="!w-4/6 !px-0"
                        size="small"
                        current={currentStep}
                        status={stepStatus}
                        labelPlacement="vertical"
                        /> */}

                    <div className="flex gap-2">
                        <ReleaseStatusTag
                            style={{
                                padding: '2px 16px',
                            }}
                            status={releaseData?.status}
                        />
                        {releaseData && (
                            <Tag
                                style={{
                                    padding: '2px 16px',
                                }}
                                color={
                                    releaseData.isImportedFromReport
                                        ? 'blue'
                                        : 'purple'
                                }
                            >
                                {releaseData.isImportedFromReport
                                    ? messages('release.importedFromReport')
                                    : messages('release.createdDirectly')}
                            </Tag>
                        )}
                    </div>

                    <div>
                        {!isCreateReleasePage && !isReadMode && (
                            <Button
                                loading={isDistributingRelease}
                                onClick={handleDistribution}
                                type="primary"
                                disabled={validateLength > 0 || isAnyMutating}
                                shape="default"
                            >
                                {messages('release.action.submit')}
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <AppForm
                form={form}
                // onFinish={handleFinish}
                layout="vertical"
                showSubmit={false}
            >
                <div className="flex justify-between gap-4">
                    <div className="flex w-3/4 items-start gap-4">
                        <CustomTooltip
                            title={
                                <>
                                    {coverArtRequirements.map((requirement) => (
                                        <div key={requirement}>
                                            - {requirement}
                                        </div>
                                    ))}
                                </>
                            }
                            placement="right"
                            styles={{
                                body: {
                                    minWidth: '300px',
                                },
                            }}
                        >
                            <AppFormItem
                                name="thumbnail"
                                help={null}
                                validateStatus={
                                    hasCoverArtError ? 'error' : undefined
                                }
                            >
                                <ImageListUpload
                                    id="releaseCoverArts"
                                    loading={isUploading || isCoverArtLoading}
                                    disabled={isCreateReleasePage || isReadMode}
                                    style={{
                                        borderColor: hasCoverArtError
                                            ? token.colorError
                                            : undefined,
                                        borderStyle: hasCoverArtError
                                            ? 'solid'
                                            : undefined,
                                        borderWidth: hasCoverArtError
                                            ? 1
                                            : undefined,
                                    }}
                                    className={cn(
                                        'release-detail-header-upload !aspect-square !size-28 !rounded-lg !p-0 transition-all duration-300',
                                        {
                                            '!size-16 transition-all duration-300':
                                                isScrolled,
                                        }
                                    )}
                                    accept=".jpg,.jpeg,.tiff,.tif"
                                    maxCount={1}
                                    maxSizeMB={10}
                                    placeholder={messages('common.uploadImage')}
                                    onChange={handleImageUpload}
                                    onRemove={handleRemoveImage}
                                    onGetPreviewUrl={handleGetPreviewUrl}
                                />
                            </AppFormItem>
                        </CustomTooltip>

                        {/* release info */}
                        <ReleaseInfoV2 isScrolled={isScrolled} />
                    </div>

                    {!isCreateReleasePage && (
                        <div className="flex flex-col justify-between gap-2">
                            <div className="space-y-2">
                                <p className="text-nowrap text-xs text-gray-500">
                                    {messages('common.lastEdit')}:{' '}
                                    {releaseData?.modifier?.name} |{' '}
                                    {formattedDate(releaseData?.updatedAt)}
                                </p>

                                <div className="flex justify-between">
                                    <div>{isScrolled && <DownloadMenu />}</div>
                                    <PermissionGate
                                        permission={PERMISSION.RELEASE.UPDATE}
                                    >
                                        {isReadMode && (
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() =>
                                                    handleChangeAction(
                                                        RELEASE_DETAIL_ACTION.EDIT
                                                    )
                                                }
                                            >
                                                {messages('common.edit')}
                                            </Button>
                                        )}
                                    </PermissionGate>
                                </div>
                            </div>
                            {!isScrolled && (
                                <div className="flex justify-end">
                                    <DownloadMenu />
                                </div>
                            )}
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

            {typeModal === TYPE_MODAL_RELEASE.DELETE && (
                <AppConfirm
                    open
                    onOk={() => handleDeleteRelease()}
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} ${messages('release.label').toLowerCase()}`}
                    paragraph={messages('delete.confirmMessage', {
                        value: releaseData?.title,
                    })}
                />
            )}
        </div>
    );
}
