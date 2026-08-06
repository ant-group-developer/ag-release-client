import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import PlatformSelect from '@/components/ui/select/platform-select';
import AppSwitch from '@/components/ui/switch/status-switch';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_LARGE } from '@/constants/page-size';
import { ACCEPT_IMAGE, MAX_NAME_LENGTH } from '@/constants/validate';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Button, Divider, Form, Input, Spin, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { ExternalLink, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCreateArtist } from '../../hooks/use-create-artist';
import { useGetDetailArtist } from '../../hooks/use-get-detail-artist';
import { useUpdateArtist } from '../../hooks/use-update-artist';
import { ArtistData } from '../../types';
import { CreateArtistPayload, UpdateArtistPayload } from '../../types/payload';

type ArtistFormValues = Omit<ArtistData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {
    onCreateSuccess?: (data: ArtistData) => void;
    onUpdateSuccess?: (data: ArtistData) => void;
    // isAddReleaseArtist?: boolean;
    // isAddReleaseContributor?: boolean;
};

export default function ArtistFormModal({
    // isAddReleaseArtist = false,
    // isAddReleaseContributor = false,
    onCreateSuccess,
    onUpdateSuccess,
    ...props
}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const dataEdit = useModalStore<ArtistData>((state) => state.dataEdit);
    const closeModal = useModalStore((state) => state.closeModal);

    const { active, isActive, deActive } = useActive();
    const [isAutoProfile, setIsAutoProfile] = useState(true);
    const isUpdateForm = dataEdit?.id;
    const watchedProfiles = Form.useWatch('artistProfiles', form) || [];

    const releaseValues = useReleaseFormStore((state) => state.formValues);
    // const { createReleaseArtist } = useCreateReleaseArtist();
    // const { createReleaseContributor } = useCreateReleaseContributor();
    const { createArtist } = useCreateArtist();
    const { updateArtist } = useUpdateArtist();
    const { dspData } = useGetListDsp({ pageSize: PAGE_SIZE_LARGE });
    const { artistData, isLoading: isLoadingArtist } = useGetDetailArtist(
        dataEdit?.id
    );
    const isOnLoadingData = isLoadingArtist && !!dataEdit?.id;

    const handleCreateArtist = (values: ArtistFormValues) => {
        const variables: CreateVariables<CreateArtistPayload> = {
            payload: values,
            onSuccess: (data: ArtistData) => {
                deActive();
                form.resetFields();
                // if (isAddReleaseArtist) {
                //     closeModal();
                //     createReleaseArtist({
                //         payload: {
                //             releaseId: releaseValues?.id as string,
                //             artistId: data.id,
                //             addArtistToTracks: false,
                //         },
                //     });
                // }
                // if (isAddReleaseContributor) {
                //     closeModal();
                //     createReleaseContributor({
                //         payload: {
                //             releaseId: releaseValues?.id as string,
                //             artistId: data.id,
                //             artistRoleId: '',
                //             addContributorToTracks: false,
                //         },
                //     });
                // }
                onCreateSuccess?.(data);
            },
            onError: () => {
                deActive();
            },
        };
        createArtist(variables);
    };

    const handleUpdateArtist = (values: ArtistFormValues) => {
        const variables: UpdateVariables<
            ArtistData['id'],
            UpdateArtistPayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: (data) => {
                deActive();
                onUpdateSuccess?.(data);
            },
            onError: () => {
                deActive();
            },
        };

        updateArtist(variables);
    };

    const onFinish = async (values: ArtistFormValues) => {
        const { pictureFile, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        active();
        const payloadValues = res;
        if (file) {
            const dataPayload = {
                entityType: ENTITY_TYPE_PICTURE.ARTIST,
                fileName: file.name,
                contentType: file.type,
                fileSize: file.size,
            };

            try {
                const urlPublic = await uploadApi.uploadFile({
                    infoFile: dataPayload,
                    file: file,
                });
                if (urlPublic) {
                    payloadValues.picture = urlPublic;
                }
            } catch (error) {
                deActive();
            }
        } else if (!file && !oldFile) {
            // payloadValues.picture = null;
            const defaultImage = getAvatarUrl(values.name);
            payloadValues.picture = defaultImage;
        }

        return isUpdateForm
            ? handleUpdateArtist(payloadValues)
            : handleCreateArtist(payloadValues);
    };

    const titleModal = isUpdateForm
        ? messages('artist.update')
        : messages('artist.create');

    useEffect(() => {
        if (!isUpdateForm && dspData?.items?.length && isAutoProfile) {
            const defaultNames = ['spotify', 'apple'];
            const defaultProfiles = defaultNames
                .map((keyword) =>
                    dspData.items.find((dsp) =>
                        dsp.name.toLowerCase().includes(keyword)
                    )
                )
                .filter(Boolean)
                .map((dsp) => ({
                    dspId: dsp!.id,
                    // name: dsp!.name,
                    name: ' ',
                    url: '',
                }));

            if (defaultProfiles.length > 0) {
                const current = form.getFieldValue('artistProfiles');
                if (!current || current.length === 0) {
                    form.setFieldsValue({ artistProfiles: defaultProfiles });
                }
            }
        }
    }, [isUpdateForm, dspData, form, isAutoProfile]);

    useEffect(() => {
        const initialData = {
            ...artistData,
            pictureFile: artistData?.picture
                ? {
                      fileList: [
                          {
                              uid: artistData?.id,
                              thumbUrl: artistData?.picture,
                              url: artistData?.picture,
                              name: artistData?.name,
                          },
                      ],
                  }
                : undefined,
        };
        if (isUpdateForm && dspData) {
            form.setFieldsValue(initialData);
        }
    }, [artistData, isUpdateForm, form, dspData]);

    return (
        <AppModal
            {...props}
            title={titleModal}
            onOk={form.submit}
            loading={isActive}
            className="!top-5 !w-[50vw]"
            styles={{
                body: {
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    paddingRight: '8px',
                },
            }}
            okButtonProps={{
                disabled: isOnLoadingData,
            }}
        >
            <Spin spinning={isOnLoadingData}>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="horizontal"
                    disabled={isActive}
                >
                    <AppFormItem name="pictureFile" label={'Avatar'}>
                        <ImageListUpload
                            maxCount={1}
                            accept={ACCEPT_IMAGE}
                            maxSizeMB={3}
                            description={
                                <ul className="space-y-1 text-xs">
                                    <li className="flex-1 text-sm text-gray-500">
                                        {messages(
                                            'image.validation.supportImageFormat',
                                            {
                                                value: 'PNG, JPG, WEBP, SVG, ICON',
                                            }
                                        )}
                                    </li>
                                    <li className="flex-1 text-sm text-gray-500">
                                        {messages(
                                            'image.validation.mustBeLessThanMB',
                                            {
                                                value: '3',
                                            }
                                        )}
                                    </li>
                                </ul>
                            }
                            disabled={isActive}
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="name"
                        label={messages('artist.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: messages('artist.name'),
                                }),
                            },
                            {
                                min: 2,
                                message: messages('validation.stringMin', {
                                    min: 2,
                                    field: messages('artist.name'),
                                }),
                            },
                            {
                                whitespace: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="countryId"
                        label={messages('country.label')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <CountrySelect />
                    </AppFormItem>

                    <AppFormItem
                        name="genreId"
                        label={messages('genre.label')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <GenresSelect />
                    </AppFormItem>

                    <AppFormItem
                        name="biography"
                        label={messages('common.biography')}
                        rules={[
                            {
                                max: 250,
                                message: messages('validation.max', {
                                    number: 250,
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            showCount
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            allowClear
                            className="mb-2"
                        />
                    </AppFormItem>

                    <Divider />
                    <div className="mb-3 flex items-center justify-between">
                        <span className="font-semibold">
                            {messages('dsp.profileList')}
                        </span>
                        {!isUpdateForm && (
                            <AppSwitch
                                defaultChecked
                                onChange={(checked) => {
                                    setIsAutoProfile(checked);
                                    if (!checked) {
                                        form.setFieldsValue({
                                            artistProfiles: [],
                                        });
                                    }
                                }}
                            />
                        )}
                    </div>

                    {(isUpdateForm || isAutoProfile) && (
                        <Form.List name={'artistProfiles'}>
                            {(fields, { add, remove }) => (
                                <div className="overflow-y-auto">
                                    <Table
                                        dataSource={fields.map((field) => ({
                                            ...field,
                                            fieldKey: field.key,
                                        }))}
                                        rowKey="key"
                                        pagination={false}
                                        size="small"
                                        bordered
                                        columns={[
                                            {
                                                title: '#',
                                                width: 50,
                                                align: 'center' as const,
                                                render: (
                                                    _: any,
                                                    __: any,
                                                    index: number
                                                ) => <span>{index + 1}</span>,
                                            },
                                            {
                                                title: messages(
                                                    'common.platforms'
                                                ),
                                                width: '25%',
                                                render: (
                                                    _: any,
                                                    field: any
                                                ) => (
                                                    <AppFormItem
                                                        name={[
                                                            field.name,
                                                            'dspId',
                                                        ]}
                                                        required
                                                        noStyle
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    messages(
                                                                        'validation.input'
                                                                    ),
                                                            },
                                                        ]}
                                                    >
                                                        <PlatformSelect
                                                            allowClear
                                                            placeholder={messages(
                                                                'common.platforms'
                                                            )}
                                                            className="w-full"
                                                        />
                                                    </AppFormItem>
                                                ),
                                            },
                                            {
                                                title: messages('artist.name'),
                                                width: '25%',
                                                render: (
                                                    _: any,
                                                    field: any
                                                ) => (
                                                    <AppFormItem
                                                        name={[
                                                            field.name,
                                                            'name',
                                                        ]}
                                                        noStyle
                                                        rules={[
                                                            {
                                                                max: MAX_NAME_LENGTH,
                                                                message:
                                                                    messages(
                                                                        'validation.stringMax',
                                                                        {
                                                                            max: MAX_NAME_LENGTH,
                                                                            field: messages(
                                                                                'channel.name'
                                                                            ),
                                                                        }
                                                                    ),
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            placeholder={messages(
                                                                'common.name'
                                                            )}
                                                        />
                                                    </AppFormItem>
                                                ),
                                            },
                                            {
                                                title: messages('common.link'),
                                                render: (
                                                    _: any,
                                                    field: any
                                                ) => (
                                                    <AppFormItem
                                                        name={[
                                                            field.name,
                                                            'url',
                                                        ]}
                                                        required
                                                        noStyle
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    messages(
                                                                        'validation.input'
                                                                    ),
                                                            },
                                                            {
                                                                max: MAX_NAME_LENGTH,
                                                                message:
                                                                    messages(
                                                                        'validation.stringMax',
                                                                        {
                                                                            max: MAX_NAME_LENGTH,
                                                                            field: 'URL',
                                                                        }
                                                                    ),
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            allowClear
                                                            placeholder="https://..."
                                                            onChange={(e) => {
                                                                const url =
                                                                    e.target.value.toLowerCase();
                                                                const matched =
                                                                    dspData?.items.find(
                                                                        (dsp) =>
                                                                            dsp.formatLinks?.some(
                                                                                (
                                                                                    link: string
                                                                                ) =>
                                                                                    url.includes(
                                                                                        link.toLowerCase()
                                                                                    )
                                                                            )
                                                                    );
                                                                if (matched) {
                                                                    const current =
                                                                        form.getFieldValue(
                                                                            'artistProfiles'
                                                                        ) || [];
                                                                    current[
                                                                        field.name
                                                                    ] = {
                                                                        ...(current[
                                                                            field
                                                                                .name
                                                                        ] ||
                                                                            {}),
                                                                        dspId: matched.id,
                                                                    };
                                                                    form.setFieldsValue(
                                                                        {
                                                                            artistProfiles:
                                                                                current,
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </AppFormItem>
                                                ),
                                            },
                                            {
                                                title: '',
                                                width: 80,
                                                align: 'center' as const,
                                                render: (
                                                    _: any,
                                                    field: any
                                                ) => {
                                                    const url =
                                                        watchedProfiles[
                                                            field.name
                                                        ]?.url;
                                                    const hasUrl =
                                                        !!url?.trim();
                                                    return (
                                                        <div className="flex items-center gap-1">
                                                            <IconButton
                                                                type="button"
                                                                onClick={() => {
                                                                    if (
                                                                        hasUrl
                                                                    ) {
                                                                        window.open(
                                                                            url.startsWith(
                                                                                'http'
                                                                            )
                                                                                ? url
                                                                                : `https://${url}`,
                                                                            '_blank'
                                                                        );
                                                                    }
                                                                }}
                                                                disabled={
                                                                    !hasUrl
                                                                }
                                                            >
                                                                <ExternalLink
                                                                    size={
                                                                        SIZE_ICON
                                                                    }
                                                                    className={
                                                                        hasUrl
                                                                            ? 'text-blue-500'
                                                                            : 'text-gray-300'
                                                                    }
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                type="button"
                                                                onClick={() =>
                                                                    remove(
                                                                        field.name
                                                                    )
                                                                }
                                                                disabled={
                                                                    isActive
                                                                }
                                                            >
                                                                <Trash
                                                                    size={
                                                                        SIZE_ICON
                                                                    }
                                                                    className="text-red-500"
                                                                />
                                                            </IconButton>
                                                        </div>
                                                    );
                                                },
                                            },
                                        ]}
                                        scroll={{
                                            y: 160,
                                        }}
                                    />

                                    <div className="my-4">
                                        <Button
                                            className="w-full"
                                            type="dashed"
                                            onClick={() => add()}
                                        >
                                            + {messages('action.create.button')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form.List>
                    )}
                </AppForm>
            </Spin>
        </AppModal>
    );
}
