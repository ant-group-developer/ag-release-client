import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import PlatformSelect from '@/components/ui/select/platform-select';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_LARGE } from '@/constants/page-size';
import { ACCEPT_IMAGE, MAX_NAME_LENGTH } from '@/constants/validate';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Button, Card, Divider, Form, Input, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateArtist } from '../../hooks/use-create-artist';
import { useGetDetailArtist } from '../../hooks/use-get-detail-artist';
import { useUpdateArtist } from '../../hooks/use-update-artist';
import { ArtistData } from '../../types';
import { CreateArtistPayload, UpdateArtistPayload } from '../../types/payload';

type ArtistFormValues = Omit<ArtistData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function ArtistFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const dataEdit = useModalStore((state) => {
        return state.dataEdit as ArtistData;
    });

    const { active, isActive, deActive } = useActive();
    const isUpdateForm = dataEdit?.id;

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
            onSuccess: () => {
                deActive();
                form.resetFields();
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
            onSuccess: () => {
                deActive();
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
            className="!top-6 !w-[50vw]"
            styles={{
                body: {
                    maxHeight: '80vh',
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
                        // required
                        rules={[
                            // {
                            //     required: true,
                            //     message: messages('validation.input'),
                            // },
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

                    <Form.List name={'artistProfiles'}>
                        {(fields, { add, remove }) => (
                            <div className="overflow-y-auto">
                                <Divider />
                                <p className="mb-2 font-semibold">
                                    {' '}
                                    {messages('dsp.profileList')}{' '}
                                </p>
                                <div className="space-y-4">
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Card
                                                key={key}
                                                styles={{
                                                    body: {
                                                        paddingRight: '38px',
                                                    },
                                                }}
                                            >
                                                <div className="relative">
                                                    <AppFormItem
                                                        {...restField}
                                                        className="flex-1"
                                                        name={[name, 'url']}
                                                        label={'Url'}
                                                        required
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
                                                                        name
                                                                    ] = {
                                                                        ...(current[
                                                                            name
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
                                                    <IconButton
                                                        onClick={() => {
                                                            const currentProfiles =
                                                                form.getFieldValue(
                                                                    'artistProfiles'
                                                                ) || [];

                                                            remove(name);
                                                        }}
                                                        className="absolute right-[-34px] top-0 mb-1"
                                                        disabled={isActive}
                                                    >
                                                        <Trash
                                                            size={SIZE_ICON}
                                                            className="text-red-500"
                                                        />
                                                    </IconButton>
                                                </div>
                                                <AppFormItem
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    label={messages(
                                                        'channel.name'
                                                    )}
                                                    required
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
                                                            message: messages(
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
                                                    <Input allowClear />
                                                </AppFormItem>
                                                <AppFormItem
                                                    {...restField}
                                                    name={[name, 'dspId']}
                                                    label={messages(
                                                        'common.platforms'
                                                    )}
                                                    required
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
                                                    />
                                                </AppFormItem>
                                            </Card>
                                        )
                                    )}
                                </div>
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
                </AppForm>
            </Spin>
        </AppModal>
    );
}
