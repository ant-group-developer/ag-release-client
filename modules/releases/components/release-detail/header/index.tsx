import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { ACCEPT_IMAGE } from '@/constants/validate';
import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
import { APP_ROUTES } from '@/enums/routes';
import { formattedDate } from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { showNotification, toastPromise } from '@/helpers/messages-helper';
import { cn } from '@/helpers/tailwind';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { useDistributeRelease } from '@/modules/distribution/hooks/use-distribute';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { DistributeRelease } from '@/modules/distribution/types/payload';
import { TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
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
import { Button, Form, Segmented, Steps, type StepsProps, theme } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';
import {
    Box,
    CircleAlert,
    FileSearch,
    NotebookText,
    PackageX,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RELEASES_STATUS } from '../../../enums';
import DownloadMenu from './download-menu';
import OptionsMenu from './options-menu';
import ReleaseInfoV2 from './release-info-v2';
type Props = {
    isScrolled: boolean;
};

export default function ReleaseDetailHeader({ isScrolled }: Props) {
    // hooks - state
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const queryClient = useQueryClient();
    const selectedRows = useReleaseDistribute((state) => state.selectedRows);

    const messages = useTranslations();
    const [form] = Form.useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const params = useParams();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { token } = theme.useToken();
    const router = useRouter();
    const releaseAction = useReleaseActionStore((state) => state.action);
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);

    // apis
    const { updateReleaseDraft, isPending: isUpdatingRelease } =
        useUpdateReleaseDraft();
    const coverArtFileId = formValues?.coverArtThumbnails?.original ?? '';
    const { linkReadFile, isFetching: isCoverArtLoading } =
        useGetLinkReadFile(coverArtFileId);
    const { releaseData } = useGetDetailRelease(formValues?.id as string);
    const { deleteRelease } = useDeleteRelease();
    const { releaseValidateData } = useReleaseValidate(
        formValues?.id as string
    );
    const { distributeRelease, isPending: isDistributingRelease } =
        useDistributeRelease();

    // const
    const isCreateReleasePage = params['action'] === 'create';

    const getActiveTextColor = (action: RELEASE_DETAIL_ACTION) =>
        releaseAction === action ? { color: token.colorPrimary } : undefined;

    const segmentedOptions: SegmentedOptions = [
        {
            icon: (
                <EyeOutlined
                    style={getActiveTextColor(RELEASE_DETAIL_ACTION.READ)}
                />
            ),
            label: (
                <span style={getActiveTextColor(RELEASE_DETAIL_ACTION.READ)}>
                    {messages('common.watch')}
                </span>
            ),
            value: RELEASE_DETAIL_ACTION.READ,
        },
        {
            icon: (
                <EditOutlined
                    style={getActiveTextColor(RELEASE_DETAIL_ACTION.EDIT)}
                />
            ),
            label: (
                <span style={getActiveTextColor(RELEASE_DETAIL_ACTION.EDIT)}>
                    {messages('common.edit')}
                </span>
            ),
            value: RELEASE_DETAIL_ACTION.EDIT,
        },
    ];
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    const statusItems: StepsProps['items'] = [
        {
            title: messages('common.draft'),
            icon: <NotebookText size={SIZE_ICON} />,
        },
        {
            title: messages('common.processing'),
            icon: <FileSearch size={SIZE_ICON} />,
        },
        {
            title: messages('issue.label'),
            icon: <CircleAlert size={SIZE_ICON} />,
        },
        {
            title: messages('common.distributed'),
            icon: <Box size={SIZE_ICON} />,
        },
        {
            title: messages('common.takenDown'),
            icon: <PackageX size={SIZE_ICON} />,
        },
    ];

    const { currentStep, stepStatus } = useMemo(() => {
        const status = formValues?.status;
        switch (status) {
            case RELEASES_STATUS.DRAFT:
            case RELEASES_STATUS.NEVER_DISTRIBUTED:
                return { currentStep: 0, stepStatus: 'process' as const };
            case RELEASES_STATUS.PROCESSING:
                return { currentStep: 1, stepStatus: 'process' as const };
            case RELEASES_STATUS.ISSUES:
                return { currentStep: 2, stepStatus: 'error' as const };
            case RELEASES_STATUS.DISTRIBUTED:
                return { currentStep: 3, stepStatus: 'finish' as const };
            case RELEASES_STATUS.TAKEN_DOWN:
                return { currentStep: 4, stepStatus: 'error' as const };
            default:
                return { currentStep: 0, stepStatus: 'process' as const };
        }
    }, [formValues?.status]);
    const validateLength = releaseValidateData && releaseValidateData?.length;

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
    const handleDistribution = () => {
        closeModal();
        const dspCode = selectedRows.map((row) => row.dsp.code);

        const variables: DistributeRelease = {
            id: formValues?.id ?? '',
            code: dspCode,
        };
        const promise = distributeRelease(variables);
        toastPromise(promise, messages);
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
            <div
                className="flex justify-between overflow-hidden px-6 transition-all duration-300"
                style={{
                    maxHeight: isScrolled ? 0 : 100,
                    opacity: isScrolled ? 0 : 1,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: isScrolled ? 0 : 8,
                    paddingBottom: isScrolled ? 0 : 24,
                }}
            >
                <Steps
                    className="!w-4/6 !px-0"
                    size="small"
                    current={currentStep}
                    status={stepStatus}
                    labelPlacement="vertical"
                    items={statusItems}
                />

                <div>
                    <Button
                        loading={isDistributingRelease}
                        onClick={handleDistribution}
                        type="primary"
                        disabled={validateLength > 0}
                    >
                        {messages('release.action.submit')}
                    </Button>
                </div>
            </div>

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
                                    <div>
                                        {messages('release.coverArt.required')}
                                    </div>
                                    <div>
                                        - {messages('release.coverArt.size')}
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
                            styles={{
                                body: {
                                    minWidth: '300px',
                                },
                            }}
                        >
                            <AppFormItem name="thumbnail">
                                <ImageListUpload
                                    id="releaseCoverArts"
                                    loading={isUploading || isCoverArtLoading}
                                    disabled={isCreateReleasePage || isReadMode}
                                    className={cn(
                                        'release-detail-header-upload !aspect-square !size-28 !rounded-lg !border-0 !p-0 transition-all duration-300',
                                        {
                                            '!size-16 transition-all duration-300':
                                                isScrolled,
                                        }
                                    )}
                                    accept={ACCEPT_IMAGE}
                                    maxCount={1}
                                    minWidth={1400}
                                    maxSizeMB={10}
                                    placeholder={messages('common.uploadImage')}
                                    onChange={handleImageUpload}
                                    onRemove={handleRemoveImage}
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
                                <div className="flex justify-end">
                                    <Segmented
                                        value={releaseAction}
                                        options={segmentedOptions}
                                        onChange={(val) =>
                                            handleChangeAction(
                                                val as RELEASE_DETAIL_ACTION
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            {!isScrolled && (
                                <div className="flex justify-end">
                                    <DownloadMenu />
                                    <OptionsMenu />
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
