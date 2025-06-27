import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateGenre } from '../../hooks/use-create-genre';
import { useUpdateGenre } from '../../hooks/use-update-genre';
import { GenresData } from '../../types';
import { CreateGenrePayload, UpdateGenrePayload } from '../../types/payload';

type GenreFormValues = Omit<GenresData, 'id' | 'createdAt' | 'updatedAt'> & {};

type Props = Omit<AppModalProps, 'children'> & {};

export default function GenresFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as GenresData);
    const isUpdateForm = !!dataEdit?.id;
    const { createGenre } = useCreateGenre();
    const { updateGenre } = useUpdateGenre();

    function renderTitle() {
        const isUpdate = !!dataEdit?.id;
        return `${isUpdate ? messages('common.update') : messages('common.create')} Thể loại nhạc`;
    }
    const titleModal = renderTitle();

    const handleUpdateGenre = (values: GenreFormValues) => {
        const { picture, ...res } = values;
        const variables: UpdateVariables<GenresData['id'], UpdateGenrePayload> =
            {
                id: dataEdit?.id,
                payload: {
                    ...res,
                    picture:
                        'https://img.freepik.com/free-vector/elegant-musical-notes-music-chord-background_1017-20759.jpg?semt=ais_hybrid&w=740',
                },
            };
        updateGenre(variables);
    };

    const handleCreateGenre = (values: GenreFormValues) => {
        const { picture, ...res } = values;
        const variables: CreateVariables<CreateGenrePayload> = {
            payload: {
                ...res,
                picture:
                    'https://img.freepik.com/free-vector/elegant-musical-notes-music-chord-background_1017-20759.jpg?semt=ais_hybrid&w=740',
            },
        };
        createGenre(variables);
    };

    const onFinish = (values: GenreFormValues) => {
        return isUpdateForm
            ? handleUpdateGenre(values)
            : handleCreateGenre(values);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
            picture: dataEdit?.picture
                ? {
                      fileList: [
                          {
                              uid: dataEdit?.id,
                              thumbUrl: dataEdit?.picture,
                              url: dataEdit?.picture,
                              name: dataEdit?.name,
                          },
                      ],
                  }
                : undefined,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={500}
            {...props}
            title={titleModal}
            open
            onCancel={closeModal}
            onOk={form.submit}
            className="!top-4"
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onFinish}
                layout="vertical"
            >
                <div className="flex items-center gap-4">
                    <AppFormItem
                        name="picture"
                        label={messages('common.image')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <ImageListUpload
                            maxCount={1}
                            maxSizeMB={3}
                            accept="image/*"
                        />
                    </AppFormItem>
                    <p className="flex-1 text-center text-sm text-gray-500">
                        {messages('image.validation.supportImageFormat', {
                            value: 'PNG, JPG, JPEG',
                        })}
                    </p>
                </div>
                <AppFormItem
                    name="name"
                    label={messages('formFields.genres')}
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
                    <Input
                        placeholder={messages('formFields.genres')}
                        allowClear
                    />
                </AppFormItem>

                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                    rules={[
                        {
                            max: 300,
                            message: messages('validation.max', {
                                number: 300,
                            }),
                        },
                    ]}
                >
                    <Input.TextArea
                        className="!mb-2"
                        showCount
                        placeholder={messages('common.description')}
                        allowClear
                        autoSize={{ minRows: 4, maxRows: 6 }}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
