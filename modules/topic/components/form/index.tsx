import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import { useLoading } from '@/hooks/use-loading';
import useModalStore from '@/hooks/use-modal';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { ProductTypeData } from '@/modules/product-types/types';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { uploadApi } from '@/modules/upload/apis';
import { GOOGLE_ILLUSTRATIVE_FOLDER_ID } from '@/modules/upload/constants/folder';
import UserSelect from '@/modules/user/components/user-select';
import { Form, Input, InputNumber, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useCreateTopicWithConfig } from '../../hooks/use-create-topic';
import { useGetImageTopic } from '../../hooks/use-get-image-topic';
import { TopicData } from '../../types';
import {
    CreateTopicPayload,
    CreateTopicPayloadWithConfig,
    CreateTopicWithConfig,
} from '../../types/create-topic';
import { SelectTopics } from './form-select-topics';

type Props = {
    dataEdit: TopicData | null;
    dataParentCode?: TopicData[];
} & Omit<AppModalProps, 'children'>;

export default function TopicForm({
    dataParentCode,
    dataEdit,
    ...props
}: Props) {
    const messages = useTranslations();
    const { isActive, active, deActive } = useActive();
    const [form] = Form.useForm();
    const parentIdValue = useWatch('parentId', form);
    const { productTypesData } = useGetProductTypes();
    // const [ref, entry] = useIntersectionObserver({
    //     threshold: 0,
    //     root: null,
    //     rootMargin: '0px',
    // });
    const loading = useLoading();

    const closeModal = useModalStore((state) => state.closeModal);
    // const { createTopic } = useCreateTopic();
    const { createTopicWithConfig } = useCreateTopicWithConfig();
    // const { updateTopic } = useUpdateTopic();

    const imageUrl = useGetImageTopic(
        dataEdit?.imageIllustrativeId as TopicData['imageIllustrativeId'],
        true,
        dataEdit?.imageIllustrative?.googleDriveFileId
    );

    const isUpdate = Boolean(dataEdit?.id);

    const productTypeVideo = productTypesData?.items?.find(
        (item) => item.code === PRODUCT_TYPE.VIDEO
    );

    const productTypeImage = productTypesData?.items?.find(
        (item) => item.code === PRODUCT_TYPE.IMAGE
    );

    const productTypeSource = productTypesData?.items?.find(
        (item) => item.code === PRODUCT_TYPE.SOURCE
    );

    const modalTitle = isUpdate
        ? messages('topic.updateTopic') + ` ${dataEdit?.code}`
        : messages('topic.createTopic');
    const initialValues = dataEdit
        ? {
              ...dataEdit,
              parentId: dataEdit?.parent?.id,
              illustrativeImage: dataEdit?.imageIllustrativeId
                  ? {
                        fileList: [
                            {
                                uid: dataEdit.id,
                                name: dataEdit.code,
                                status: 'done',
                                url: imageUrl,
                            },
                        ],
                    }
                  : undefined,
          }
        : {};

    const handleCreate = async (values: any) => {
        try {
            active();
            const {
                videoAssigneeId,
                imageAssigneeId,
                sourceAssigneeId,
                illustrativeImage,
                videoReviewerId,
                imageReviewerId,
                sourceReviewerId,
                imageRate,
                videoRate,
                sourceRate,
                code,
                parentId,
                ...res
            } = values;
            const file = illustrativeImage?.fileList[0]?.originFileObj;
            let fileData: CreateTopicPayload['imageIllustrative'] = undefined;
            if (file) {
                const fileId = await uploadApi.uploadFileToDriveV2(
                    file,
                    GOOGLE_ILLUSTRATIVE_FOLDER_ID
                );
                fileData = {
                    key: '',
                    contentType: file.type,
                    extension: file.name.split('.').pop(),
                    fileSizeInByte: file.size,
                    fileName: file.name,
                    googleDriveFileId: fileId,
                };
            }

            const assigneeIdVideo = values?.videoAssigneeId;
            const assigneeIdImage = values?.imageAssigneeId;
            const assigneeIdSource = values?.sourceAssigneeId;

            const reviewerVideo = values?.videoReviewerId;
            const reviewerImage = values?.imageReviewerId;
            const reviewerSource = values?.sourceReviewerId;

            const rateVideo = values?.videoRate;
            const rateImage = values?.imageRate;
            const rateSource = values?.sourceRate;

            const payload: CreateTopicPayloadWithConfig = {
                topicData: {
                    ...res,
                    parentId,
                    imageIllustrative: fileData,
                },
                listConfigTopic: [
                    {
                        productTypeId:
                            productTypeVideo?.id as ProductTypeData['id'],
                        approverId: reviewerVideo,
                        assigneeId: assigneeIdVideo,
                        rate: rateVideo,
                    },
                    {
                        productTypeId:
                            productTypeImage?.id as ProductTypeData['id'],
                        approverId: reviewerImage,
                        assigneeId: assigneeIdImage,
                        rate: rateImage,
                    },
                    {
                        productTypeId:
                            productTypeSource?.id as ProductTypeData['id'],
                        approverId: reviewerSource,
                        assigneeId: assigneeIdSource,
                        rate: rateSource,
                    },
                ],
            };
            // Nếu không có parentId thì mới truyền code
            if (!parentId) {
                payload.topicData.code = code;
            }

            const createVariables: CreateTopicWithConfig = {
                payload,
                onSuccess: () => {
                    form.resetFields();
                    deActive();
                },
                onError: (errors: any) => {
                    deActive();
                    const errorMessages = errors.map((item: any) => ({
                        name: item.key,
                        errors: [messages(item.message)],
                    }));

                    form.setFields(errorMessages);
                },
            };
            createTopicWithConfig(createVariables);
        } catch (error) {
            deActive();
        }
    };

    // const handleUpdate = async (values: any) => {
    //     try {
    //         active();
    //         const { illustrativeImage, ...res } = values;
    //         const file = illustrativeImage?.fileList[0]?.originFileObj;
    //         let fileData: UpdateTopicPayload['imageIllustrative'] =
    //             illustrativeImage?.fileList.length < 1 ? null : undefined;
    //         if (file) {
    //             const fileId = await uploadApi.uploadFileToDriveV2(
    //                 file,
    //                 GOOGLE_ILLUSTRATIVE_FOLDER_ID
    //             );
    //             fileData = {
    //                 key: '',
    //                 contentType: file.type,
    //                 extension: file.name.split('.').pop(),
    //                 fileSizeInByte: file.size,
    //                 fileName: file.name,
    //                 googleDriveFileId: fileId,
    //             };
    //         }

    //         const payload: UpdateTopicPayload = {
    //             ...res,
    //             imageIllustrative: fileData,
    //         };

    //         const createVariables: UpdateTopic = {
    //             topicId: dataEdit?.id as TopicData['id'],
    //             payload,
    //             onError: (errors: any) => {
    //                 deActive();
    //                 const errorMessages = errors.map((item: any) => ({
    //                     name: item.key,
    //                     errors: [messages(item.message)],
    //                 }));

    //                 form.setFields(errorMessages);
    //             },
    //             onSuccess: () => {
    //                 deActive();
    //                 closeModal();
    //             },
    //         };
    //         return updateTopic(createVariables);
    //     } catch (error) {
    //         deActive();
    //     }
    // };

    const onFinish = async (values: any) => {
        // if (isUpdate) {
        //     handleUpdate(values);
        // } else {
        handleCreate(values);
        // }
    };

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [JSON.stringify(initialValues)]);

    return (
        <AppModal
            {...props}
            title={`${modalTitle}`}
            confirmLoading={isActive}
            onOk={() => form.submit()}
            cancelButtonProps={{ disabled: isActive }}
            width={750}
        >
            <AppForm
                form={form}
                layout="horizontal"
                initialValues={initialValues}
                onFinish={onFinish}
                showSubmit={false}
                disabled={isActive}
            >
                <AppFormItem name="parentId" label={messages('topic.bigTopic')}>
                    <SelectTopics
                        dataParentCode={dataParentCode ?? []}
                        showChildren={false}
                    />
                </AppFormItem>

                <AppFormItem
                    name="code"
                    label="Code"
                    required={loading || !parentIdValue}
                    rules={[
                        {
                            required: !parentIdValue,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input disabled={!!parentIdValue} />
                </AppFormItem>

                {parentIdValue && (
                    <AppFormItem label={messages('common.approver')}>
                        <div className="flex gap-1">
                            {productTypesData?.items?.map(
                                (item: ProductTypeData) => (
                                    <AppFormItem
                                        key={item.id}
                                        name={`${item.code}ReviewerId`}
                                        className="!mb-0 w-[33.33%]"
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message:
                                        //             messages(
                                        //                 'validation.select'
                                        //             ),
                                        //     },
                                        // ]}
                                    >
                                        <UserSelect
                                            placeholder={item.nameVi}
                                            allowClear
                                        />
                                    </AppFormItem>
                                )
                            )}
                        </div>
                    </AppFormItem>
                )}

                <AppFormItem label={messages('common.assignee')}>
                    <div className="flex gap-1">
                        {productTypesData?.items?.map((item) => (
                            <AppFormItem
                                key={item.id}
                                name={`${item.code}AssigneeId`}
                                className="!mb-0 w-[33.33%]"
                            >
                                <UserSelect
                                    placeholder={item.nameVi}
                                    allowClear
                                />
                            </AppFormItem>
                        ))}
                    </div>
                </AppFormItem>

                <AppFormItem label={messages('rating.point')}>
                    <div className="flex gap-1">
                        {productTypesData?.items?.map((item) => (
                            <AppFormItem
                                key={item.id}
                                name={`${item.code}Rate`}
                                className="!mb-0 w-[33.33%]"
                                required
                                rules={[
                                    // {
                                    //     required: true,
                                    //     message: messages('validation.input'),
                                    // },
                                    {
                                        type: 'number',
                                        min: 1,
                                        message: messages(
                                            'validation.numberMin',
                                            {
                                                number: 1,
                                            }
                                        ),
                                    },
                                ]}
                            >
                                <InputNumber
                                    placeholder={item.nameVi}
                                    className="!w-full"
                                />
                            </AppFormItem>
                        ))}
                    </div>
                </AppFormItem>

                <AppFormItem
                    name="description"
                    label={messages('common.description')}
                >
                    <TextArea
                        autoSize={{ minRows: 5, maxRows: 10 }}
                        allowClear
                    />
                </AppFormItem>
                <AppFormItem name="isActive" label={messages('status.label')}>
                    <Switch
                        value={dataEdit?.isActive}
                        defaultValue={true}
                        checkedChildren={messages('status.on')}
                        unCheckedChildren={messages('status.off')}
                    />
                </AppFormItem>
                <AppFormItem
                    name="illustrativeImage"
                    label={messages('order.illustrativeImage')}
                >
                    <ImageListUpload maxCount={1} accept="image/*" />
                </AppFormItem>
                <AppFormItem
                    name="note"
                    label={messages('common.note')}
                    rules={[
                        {
                            max: 200,
                            message: messages('validation.max', {
                                number: 200,
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 7 }}
                        allowClear
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
