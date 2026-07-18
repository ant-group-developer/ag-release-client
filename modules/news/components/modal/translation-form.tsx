import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import { AppModalProps } from '@/components/ui/modal/normal-modal';
import CodeLanguageSelect from '@/components/ui/select/code-language-select';
import TextEditor from '@/components/ui/text-editor';
import { SIZE_ICON } from '@/constants/common';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { cn } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { UpdateVariables } from '@/types/api';
import { Form, Input, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_NEWS } from '../../enums';
import { useCreateTranslation } from '../../hooks/use-create-translation';
import { useGetDetailTranslation } from '../../hooks/use-get-detail-translation';
import { useGetOriginalTranslation } from '../../hooks/use-get-original-translation';
import { useUpdateTranslation } from '../../hooks/use-update-translation';
import { NewsData, TranslationData } from '../../types';
import {
    CreateTranslation,
    UpdateTranslationPayload,
} from '../../types/payloads';

type Props = Omit<AppModalProps, 'children'> & {
    translationId?: string;
};

export default function TranslationFormModal({
    translationId,
    ...props
}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as NewsData);
    const closeModal = useModalStore((state) => state.closeModal);
    const { active, isActive, deActive } = useActive();
    const isUpdateModal = typeModal === TYPE_MODAL_NEWS.EDIT || !!translationId;

    const { createTranslation } = useCreateTranslation();
    const { updateTranslation } = useUpdateTranslation();
    // const { updateNews } = useUpdateNews();
    const { translationData, isFetching: translationFetching } =
        useGetDetailTranslation(translationId as string);

    const {
        translationData: originalTranslationData,
        isFetching: originalTranslationFetching,
    } = useGetOriginalTranslation(dataEdit?.id);

    const isOriginalTranslation = !!translationData?.isDefault && isUpdateModal;

    const handleUpdate = (value: any) => {
        const variables: UpdateVariables<
            TranslationData['id'],
            UpdateTranslationPayload
        > = {
            id: translationId as string,
            payload: value,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateTranslation(variables);
    };

    const handleCreate = (value: any) => {
        const variables: CreateTranslation = {
            payload: {
                ...value,
                newsPostId: dataEdit?.id,
            },
            onSuccess: () => {
                deActive();
                closeModal();
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
                ...translationData,
            };
            form.setFieldsValue(initialData);
        } else {
            form.resetFields();
        }
    }, [translationData, isUpdateModal]);

    return (
        <FullScreenModal
            {...props}
            title={
                isUpdateModal
                    ? messages('news.updateTranslate')
                    : messages('news.addTranslate')
            }
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
            <Spin spinning={translationFetching || originalTranslationFetching}>
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
                            {!isOriginalTranslation && (
                                <div className="">
                                    <AppFormItem
                                        label={`${messages('language.original')}`}
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
                                        <CodeLanguageSelect
                                            value={
                                                originalTranslationData?.languageCode
                                            }
                                            open={false}
                                            showSearch={false}
                                        />
                                    </AppFormItem>
                                    <AppFormItem
                                        label={`${messages('common.title')}`}
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
                                                            'common.title'
                                                        ),
                                                    }
                                                ),
                                            },
                                        ]}
                                    >
                                        <Input
                                            value={
                                                originalTranslationData?.title
                                            }
                                            allowClear
                                            readOnly
                                        />
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
                                            value={
                                                originalTranslationData?.description
                                            }
                                            autoSize={{
                                                minRows: 3,
                                                maxRows: 7,
                                            }}
                                            showCount
                                            readOnly
                                        />
                                    </AppFormItem>
                                    <AppFormItem
                                        label={messages('common.content')}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message:
                                                    messages(
                                                        'validation.input'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <TextEditor
                                            value={
                                                originalTranslationData?.content
                                            }
                                            disabled
                                            className="editor-large"
                                        />
                                    </AppFormItem>
                                </div>
                            )}

                            {/* translation */}
                            <div
                                className={cn({
                                    'col-span-2 m-auto max-w-screen-md':
                                        isOriginalTranslation,
                                })}
                            >
                                <AppFormItem
                                    name="languageCode"
                                    label={
                                        !isOriginalTranslation
                                            ? `${messages('common.translation')}`
                                            : `${messages('language.original')}`
                                    }
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
                                        allowClear
                                        disabled={
                                            isOriginalTranslation || isActive
                                        }
                                    />
                                </AppFormItem>
                                <AppFormItem
                                    name="title"
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
                                            message:
                                                messages('validation.input'),
                                        },
                                    ]}
                                >
                                    <TextEditor
                                        disabled={isActive}
                                        className="editor-large"
                                    />
                                </AppFormItem>
                            </div>
                        </div>
                    </div>
                </AppForm>
            </Spin>
        </FullScreenModal>
    );
}
