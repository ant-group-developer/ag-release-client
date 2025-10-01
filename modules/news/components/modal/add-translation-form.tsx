import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import { AppModalProps } from '@/components/ui/modal/normal-modal';
import CodeLanguageSelect from '@/components/ui/select/code-language-select';
import LanguageSelect from '@/components/ui/select/language-select';
import TextEditor from '@/components/ui/text-editor';
import { SIZE_ICON } from '@/constants/common';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { UpdateVariables } from '@/types/api';
import { ConfigProvider, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_NEWS } from '../../enums';
import { useCreateTranslation } from '../../hooks/use-create-translation';
import { useGetListKeywords } from '../../hooks/use-get-keywords';
import { useUpdateNews } from '../../hooks/use-update';
import { NewsData } from '../../types';
import { CreateTranslation, UpdateNewsPayload } from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TranslationFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as NewsData);
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = typeModal === TYPE_MODAL_NEWS.EDIT;

    const { keywordsData } = useGetListKeywords();
    const { createTranslation } = useCreateTranslation();
    const { updateNews } = useUpdateNews();
    // const { translationData } = useGetDetailTranslation(dataEdit?.id);

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
        const variables: CreateTranslation = {
            newsId: dataEdit?.id,
            payload: value,
            onSuccess: () => {
                deActive();
                form.resetFields();
            },
            onError: () => {
                deActive();
            },
        };
        createTranslation(variables);
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
        if (isUpdateModal) {
            const initialData = {
                ...dataEdit,
                pictureFile: dataEdit?.thumbnail
                    ? {
                          fileList: [
                              {
                                  uid: dataEdit?.id,
                                  thumbUrl: dataEdit?.thumbnail,
                                  url: dataEdit?.thumbnail,
                                  name: dataEdit?.title,
                              },
                          ],
                      }
                    : undefined,
            };
            form.setFieldsValue(initialData);
        }
    }, [dataEdit, isUpdateModal, form]);

    return (
        <FullScreenModal
            {...props}
            title={messages('news.addTranslate')}
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
            }}
            actionContent={messages('common.submit')}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="vertical"
                disabled={isActive}
            >
                <div className="m-auto max-w-screen-2xl">
                    <div className="grid grid-cols-2 gap-8">
                        {/* original  */}
                        <div className="">
                            <ConfigProvider componentDisabled={true}>
                                <AppFormItem
                                    label={`${messages('language.original')}`}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.input'),
                                        },
                                    ]}
                                >
                                    <CodeLanguageSelect
                                        value={dataEdit?.languageCode}
                                        allowClear
                                    />
                                </AppFormItem>
                                <AppFormItem
                                    label={`${messages('common.title')}`}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.input'),
                                        },
                                        {
                                            max: MAX_NAME_LENGTH,
                                            message: messages(
                                                'validation.stringMax',
                                                {
                                                    max: MAX_NAME_LENGTH,
                                                    field: messages(
                                                        'common.title'
                                                    ),
                                                }
                                            ),
                                        },
                                    ]}
                                >
                                    <Input value={dataEdit?.title} allowClear />
                                </AppFormItem>
                                <AppFormItem
                                    label={messages('common.description')}
                                    rules={[
                                        {
                                            max: MAX_NOTE_LENGTH,
                                            message: messages(
                                                'validation.stringMax',
                                                {
                                                    max: MAX_NOTE_LENGTH,
                                                    field: messages(
                                                        'common.description'
                                                    ),
                                                }
                                            ),
                                        },
                                    ]}
                                >
                                    <TextArea
                                        value={dataEdit?.description}
                                        autoSize={{
                                            minRows: 3,
                                            maxRows: 7,
                                        }}
                                        showCount
                                    />
                                </AppFormItem>
                                <AppFormItem
                                    label={messages('common.content')}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message:
                                                messages('validation.input'),
                                        },
                                    ]}
                                >
                                    <TextEditor
                                        value={dataEdit?.content}
                                        disabled
                                        className="editor-large"
                                    />
                                </AppFormItem>
                            </ConfigProvider>
                        </div>

                        {/* translation */}
                        <div className="">
                            <AppFormItem
                                name="languageCode"
                                label={`${messages('common.translation')}`}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <LanguageSelect allowClear />
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
                                        message: messages(
                                            'validation.stringMax',
                                            {
                                                max: MAX_NAME_LENGTH,
                                                field: messages('common.title'),
                                            }
                                        ),
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
                                        message: messages(
                                            'validation.stringMax',
                                            {
                                                max: MAX_NOTE_LENGTH,
                                                field: messages(
                                                    'common.description'
                                                ),
                                            }
                                        ),
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
                                <TextEditor className="editor-large" />
                            </AppFormItem>
                        </div>
                    </div>
                </div>
            </AppForm>
        </FullScreenModal>
    );
}
