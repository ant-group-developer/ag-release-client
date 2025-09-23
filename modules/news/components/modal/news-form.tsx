import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import { AppModalProps } from '@/components/ui/modal/normal-modal';
import NewsCategorySelect from '@/components/ui/select/news-category-select';
import TagSelect from '@/components/ui/tag/tag-select';
import TextEditor from '@/components/ui/text-editor';
import { SIZE_ICON } from '@/constants/common';
import {
    ACCEPT_IMAGE,
    MAX_NAME_LENGTH,
    MAX_NOTE_LENGTH,
} from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Image, Input, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { NEWS_STATUS } from '../../enums';
import { useCreateNews } from '../../hooks/use-create';
import { useUpdateNews } from '../../hooks/use-update';
import { NewsData } from '../../types';
import { CreateNewsPayload, UpdateNewsPayload } from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function NewsFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as NewsData);
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = dataEdit?.id;

    const { createNews } = useCreateNews();
    const { updateNews } = useUpdateNews();

    const statusOptions = [
        {
            label: messages('common.public'),
            value: NEWS_STATUS.PUBLIC,
        },
        {
            label: messages('common.private'),
            value: NEWS_STATUS.PRIVATE,
        },
    ];

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<NewsData['id'], UpdateNewsPayload> = {
            id: dataEdit?.id,
            payload: value,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateNews(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateVariables<CreateNewsPayload> = {
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createNews(variables);
    };

    const onFinish = async (values: any) => {
        const { pictureFile, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        active();

        const payloadValues = {
            ...res,
        };

        if (file) {
            const dataPayload = {
                entityType: ENTITY_TYPE_PICTURE.NEWS_POST_THUMBNAIL,
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
                    payloadValues.thumbnail = urlPublic;
                }
            } catch (error) {
                deActive();
            }
        }

        return isUpdateModal
            ? handleUpdate(payloadValues)
            : handleCreate(payloadValues);
    };

    useEffect(() => {
        const initialData = {
            ...dataEdit,
            pictureFile: dataEdit?.thumbnail
                ? {
                      fileList: [
                          {
                              uid: dataEdit?.id,
                              thumbUrl: dataEdit?.thumbnail,
                              url: dataEdit?.thumbnail,
                              name: dataEdit?.titleEn,
                          },
                      ],
                  }
                : undefined,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <FullScreenModal
            {...props}
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('news.label').toLowerCase()}`}
            footer={null}
            loading={isActive}
            showAction
            actionProps={{
                icon: <Save size={SIZE_ICON} />,
                onClick: () => {
                    form.submit();
                },
                className: 'inline-flex items-center',
                loading: isActive,
            }}
            actionContent={messages('common.submit')}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
                className="grid grid-cols-2 gap-8"
            >
                <div>
                    <div className="flex items-center gap-2">
                        <Image alt="Việt Nam" src="/languages/vi.svg" />
                        <Typography.Text strong={true} className="!text-lg">
                            {messages('language.vietnamese')}
                        </Typography.Text>
                    </div>
                    <AppFormItem
                        name="titleVi"
                        label={`${messages('common.title')}`}
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
                                    field: messages('common.title'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="descriptionVi"
                        label={messages('common.description')}
                        rules={[
                            {
                                max: MAX_NOTE_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NOTE_LENGTH,
                                    field: messages('common.description'),
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            autoSize={{
                                minRows: 3,
                                maxRows: 7,
                            }}
                            showCount
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="contentVi"
                        label={messages('common.content')}
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <TextEditor className="editor-large" />
                    </AppFormItem>
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <Image alt="English" src="/languages/en.svg" />
                        <Typography.Text strong={true} className="!text-lg">
                            {messages('language.english')}
                        </Typography.Text>
                    </div>
                    <AppFormItem
                        name="titleEn"
                        label={`${messages('common.title')}`}
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
                                    field: messages('common.title'),
                                }),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="descriptionEn"
                        label={messages('common.description')}
                        rules={[
                            {
                                max: MAX_NOTE_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NOTE_LENGTH,
                                    field: messages('common.description'),
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            autoSize={{
                                minRows: 3,
                                maxRows: 7,
                            }}
                            showCount
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="contentEn"
                        label={messages('common.content')}
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <TextEditor className="editor-large" />
                    </AppFormItem>
                </div>

                <div className="col-span-2 flex justify-between gap-8 border-t pt-8">
                    <AppFormItem
                        name="pictureFile"
                        label={`${messages('common.thumbnail')}`}
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
                            accept={ACCEPT_IMAGE}
                            maxSizeMB={3}
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="status"
                        label={`${messages('common.status')}`}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select
                            options={statusOptions}
                            placeholder={messages('common.status')}
                            className="min-w-96"
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="newsCategoryId"
                        label={`${messages('newsCategory.label')}`}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <NewsCategorySelect
                            placeholder={messages('newsCategory.label')}
                            className="min-w-96"
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="slug"
                        label={`Slug`}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input placeholder={'Slug'} className="!min-w-96" />
                    </AppFormItem>
                    <AppFormItem
                        name="keywords"
                        label={`${messages('common.keyword')}`}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <TagSelect
                            placeholder={messages('common.keyword')}
                            className="min-w-96"
                        />
                    </AppFormItem>
                </div>
            </AppForm>
        </FullScreenModal>
    );
}
