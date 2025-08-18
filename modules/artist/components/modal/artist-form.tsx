import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import PlatformSelect from '@/components/ui/select/platform-select';
import { SIZE_ICON } from '@/constants/common';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { uploadApi } from '@/modules/upload/apis';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Button, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateArtist } from '../../hooks/use-create-artist';
import { useDeleteArtistProfile } from '../../hooks/use-delete-artist-profile';
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
    const dataEdit = useModalStore((state) => state.dataEdit as ArtistData);
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = dataEdit?.id;

    const { createArtist } = useCreateArtist();
    const { updateArtist } = useUpdateArtist();
    const { dspData } = useGetListDsp({});
    const { artistData } = useGetDetailArtist(dataEdit?.id);
    const { deleteArtistProfile } = useDeleteArtistProfile();

    const handleCreateArtist = (values: ArtistFormValues) => {
        const variables: CreateVariables<CreateArtistPayload> = {
            payload: values,
            onSuccess: () => {
                form.resetFields();
                deActive();
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
                entityType: 'artists',
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
        form.setFieldsValue(initialData);
    }, [artistData]);

    return (
        <AppModal
            width={600}
            {...props}
            title={titleModal}
            open
            onOk={form.submit}
            loading={isActive}
            className="custom-scroll-artist-modal !top-6"
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="horizontal"
                disabled={isActive}
            >
                <AppFormItem name="pictureFile" label={'Avatar'}>
                    <div className="flex w-full items-center gap-4">
                        <ImageListUpload
                            maxCount={1}
                            accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                            maxSizeMB={2}
                        />
                        <div>
                            <p className="flex-1 text-sm text-gray-500">
                                {messages(
                                    'image.validation.supportImageFormat',
                                    {
                                        value: 'PNG, JPG, JPEG',
                                    }
                                )}
                            </p>
                            <p className="flex-1 text-sm text-gray-500">
                                {messages('image.validation.mustBeLessThanMB', {
                                    value: '3',
                                })}
                            </p>
                        </div>
                    </div>
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
                            max: 100,
                            message: messages('validation.max', {
                                number: 100,
                            }),
                        },
                    ]}
                >
                    <Input allowClear />
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
                        <div className="max-h-[390px] overflow-y-auto">
                            <p className="pb-8 font-bold">
                                {' '}
                                {messages('dsp.profileList').toUpperCase()}{' '}
                            </p>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key}>
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
                                                    max: 100,
                                                    message: messages(
                                                        'validation.max',
                                                        {
                                                            number: 100,
                                                        }
                                                    ),
                                                },
                                            ]}
                                        >
                                            <Input
                                                allowClear
                                                onChange={(e) => {
                                                    const url = e.target.value;
                                                    const matched =
                                                        dspData?.items.find(
                                                            (dsp) =>
                                                                dsp.formatLinks?.some(
                                                                    (
                                                                        link: string
                                                                    ) =>
                                                                        url.includes(
                                                                            link
                                                                        )
                                                                )
                                                        );

                                                    if (matched) {
                                                        const current =
                                                            form.getFieldValue(
                                                                'artistProfiles'
                                                            ) || [];
                                                        current[name] = {
                                                            ...(current[name] ||
                                                                {}),
                                                            dspId: matched.id,
                                                        };
                                                        form.setFieldsValue({
                                                            artistProfiles:
                                                                current,
                                                        });
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
                                                const profileToRemove =
                                                    currentProfiles[name];
                                                remove(name);
                                                if (profileToRemove?.id) {
                                                    deleteArtistProfile({
                                                        artistId:
                                                            artistData?.id,
                                                        profileId:
                                                            profileToRemove.id,
                                                    });
                                                }
                                            }}
                                            className="absolute right-0 top-[-32px] mb-1"
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
                                        label={messages('channel.name')}
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
                                                max: 100,
                                                message: messages(
                                                    'validation.max',
                                                    {
                                                        number: 100,
                                                    }
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input allowClear />
                                    </AppFormItem>
                                    <AppFormItem
                                        {...restField}
                                        className="!mb-8 border-b !pb-8"
                                        name={[name, 'dspId']}
                                        label={messages('common.platforms')}
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
                                        <PlatformSelect allowClear />
                                    </AppFormItem>
                                </div>
                            ))}
                            <div className="mb-4">
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
        </AppModal>
    );
}
