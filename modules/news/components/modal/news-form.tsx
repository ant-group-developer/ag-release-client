import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import { AppModalProps } from '@/components/ui/modal/normal-modal';
import CodeLanguageSelect from '@/components/ui/select/code-language-select';
import NewsCategoryTreeSelect from '@/components/ui/select/news-category-tree-select';
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
import { Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Save } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { NEWS_STATUS } from '../../enums';
import { useCreateNews } from '../../hooks/use-create';
import { useGetDetailNews } from '../../hooks/use-get-detail';
import { useGetListKeywords } from '../../hooks/use-get-keywords';
import { useUpdateNews } from '../../hooks/use-update';
import { NewsData } from '../../types';
import { CreateNewsPayload, UpdateNewsPayload } from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function NewsFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const locale = useLocale();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as NewsData);
    const { active, isActive, deActive } = useActive();
    const { newsData } = useGetDetailNews(locale, dataEdit?.slug);
    const isUpdateModal = !!dataEdit?.id;

    const { keywordsData } = useGetListKeywords();
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
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };
        createNews(variables);
    };

    const onFinish = async (values: any) => {
        const { pictureFile, keywords, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        active();

        const payloadValues = {
            ...res,
            keywords: keywords ?? [],
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
            ...newsData,
            pictureFile: newsData?.thumbnail
                ? {
                      fileList: [
                          {
                              uid: newsData?.id,
                              thumbUrl: newsData?.thumbnail,
                              url: newsData?.thumbnail,
                              name: newsData?.title,
                          },
                      ],
                  }
                : undefined,
        };
        form.setFieldsValue(initialData);
    }, [newsData]);

    return (
        <FullScreenModal
            {...props}
            title={`${isUpdateModal ? messages('common.update') : messages('common.create')} ${messages('news.label').toLowerCase()}`}
            footer={null}
            loading={isActive}
            showAction
            actionProps={{
                icon: (
                    <div>
                        <Save size={SIZE_ICON} />
                    </div>
                ),
                onClick: () => {
                    form.submit();
                },
                className: 'inline-flex items-center',
                loading: isActive,
                style: {
                    height: 34,
                },
            }}
            actionContent={messages('common.submit')}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
                initialValues={{
                    status: NEWS_STATUS.PUBLIC,
                    languageCode: locale ?? '',
                }}
            >
                <div className="m-auto grid h-[calc(100vh-68px)] w-full grid-cols-12 overflow-y-auto">
                    <div className="col-span-9 border-r px-8 py-4">
                        {/* <div className="flex items-center gap-2">
                            <Image alt="Việt Nam" src="/languages/vi.svg" />
                            <Typography.Text strong={true} className="!text-lg">
                                {messages('language.vietnamese')}
                            </Typography.Text>
                        </div> */}
                        <AppFormItem
                            name="languageCode"
                            label={`${messages('language.label')}`}
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <CodeLanguageSelect
                                disabled={isUpdateModal}
                                allowClear
                            />
                        </AppFormItem>
                        <AppFormItem
                            name="title"
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
                            name="description"
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
                            name="content"
                            label={messages('common.content')}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <TextEditor />
                        </AppFormItem>
                    </div>
                    <div className="sticky top-0 col-span-3 flex w-full flex-col gap-4 px-8 py-4">
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
                                className="w-full"
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
                            <NewsCategoryTreeSelect
                                placeholder={messages('newsCategory.label')}
                                className="w-full"
                            />
                        </AppFormItem>
                        <AppFormItem
                            className="w-full"
                            name="keywords"
                            label={`${messages('common.keyword')}`}
                            // required
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: messages('validation.input'),
                            //     },
                            // ]}
                        >
                            <TagSelect
                                keywords={keywordsData}
                                placeholder={messages('common.keyword')}
                            />
                        </AppFormItem>
                    </div>
                </div>
            </AppForm>
        </FullScreenModal>
    );
}
