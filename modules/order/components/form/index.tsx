import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import PrioritySelect from '@/components/ui/select/priority-select';
import { ACTIVE_TYPE, DATE_FORMAT, LOCALE } from '@/enums/common';
import { cn } from '@/helpers/tailwind';
import { useActive } from '@/hooks/use-active';
import useModalStore, { CloseModalProps } from '@/hooks/use-modal';
import { useOrderUpdateStore } from '@/hooks/use-order-store';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting';
import { useTopicList } from '@/modules/topic/hooks/use-get-topic';
import { TopicData } from '@/modules/topic/types';
import { uploadApi } from '@/modules/upload/apis';
import { GOOGLE_ILLUSTRATIVE_FOLDER_ID } from '@/modules/upload/constants/folder';
import {
    Checkbox,
    CheckboxProps,
    DatePicker,
    Form,
    Input,
    InputNumber,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import StatusSelect from '../../../../components/ui/select/status-select';
import { ORDER_STATUS, TYPE_MODAL_ORDER } from '../../enums';
import { getLinkIllustrative } from '../../helpers/get-link-illustrative';
import { useCreateOrder } from '../../hooks/use-create-order';
import { useUpdateOrder } from '../../hooks/use-update-order';
import { OrderData } from '../../types';
import { CreateOrder, OrderPayload } from '../../types/create-order';
import { UpdateOrder } from '../../types/update-order';
import TopicSelect from './select-topic';

type Props = {
    dataEdit: OrderData | null;
    orderCodeList?: Pick<TopicData, 'id' | 'code'>[];
    onClose: CloseModalProps;
} & Omit<AppModalProps, 'children'>;

export default function OrderForm({
    orderCodeList,
    dataEdit,
    onClose,
    ...props
}: Props) {
    const { isAdmin } = useAuth();
    const messages = useTranslations();
    const locale = useLocale();
    const [form] = Form.useForm();
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const { isActive, active, deActive } = useActive();
    const { createOrder } = useCreateOrder();
    const { updateOrder } = useUpdateOrder();
    const { data: dataSettings } = useGetSettingPublic();
    const { data: topicData } = useTopicList({ isActive: ACTIVE_TYPE.ON });
    const { productTypesData, isFetching } = useGetProductTypes();
    const typeModal = useModalStore((state) => state.typeModal);
    const disabledForm = typeModal === TYPE_MODAL_ORDER.DETAIL;
    const isCreateForm = typeModal === TYPE_MODAL_ORDER.CREATE;
    const isUpdate = typeModal === TYPE_MODAL_ORDER.UPDATE;
    const isHasIllustrativeImage =
        dataEdit && dataEdit?.orderIllustrative.length > 0 ? true : false;

    useEffect(() => {
        if (dataEdit?.orderProduct) {
            const productTypeIds = dataEdit.orderProduct.map(
                (product) => product.productType.id
            );
            setCheckedList(productTypeIds);
        }
    }, [dataEdit]);

    const getDisabledCheckbox = (productTypeId: string) => {
        if (!dataEdit?.orderProduct) return false;
        const currentOrderProduct = dataEdit.orderProduct.find(
            (product) => product.productType.id === productTypeId
        );

        // Nếu chỉ có 1 product type trong order, disable checkbox đó
        if (dataEdit?.orderProduct.length === 1 && currentOrderProduct)
            return true;

        return currentOrderProduct
            ? currentOrderProduct.status === ORDER_STATUS.NEW
                ? false
                : true
            : false;
    };

    const modalTitle = disabledForm
        ? messages('order.detailOrder') + ` ${dataEdit?.code}`
        : isUpdate
          ? messages('order.updateOrder') + ` ${dataEdit?.code}`
          : messages('order.createOrder');

    const deadlineHours = dataSettings?.deadline || 30;
    const disabledDateTime = {
        disabledDate: (current: dayjs.Dayjs) => {
            // Use dataEdit.dateCreated if available; otherwise use the current time.
            const baseTime = dataEdit?.dateCreated
                ? dayjs(dataEdit.dateCreated)
                : dayjs();
            const minAllowedTime = baseTime.add(Number(deadlineHours), 'hour');

            // Disable any date before the day of minAllowedTime.
            return current && current.isBefore(minAllowedTime, 'day');
        },

        disabledTime: (current: dayjs.Dayjs) => {
            if (!current) return {};

            const baseTime = dataEdit?.dateCreated
                ? dayjs(dataEdit.dateCreated)
                : dayjs();
            const minAllowedTime = baseTime.add(Number(deadlineHours), 'hour');

            // If the selected date is the same day as minAllowedTime.
            if (current.isSame(minAllowedTime, 'day')) {
                const minHour = minAllowedTime.hour();
                return {
                    disabledHours: () =>
                        Array.from({ length: minHour }, (_, i) => i),
                    disabledMinutes: (selectedHour: number) => {
                        if (selectedHour === minHour) {
                            const minMinute = minAllowedTime.minute();
                            return Array.from(
                                { length: minMinute },
                                (_, i) => i
                            );
                        }
                        return [];
                    },
                };
            }

            // For dates after the minAllowedTime day, no time restrictions.
            return {};
        },
    };

    const checkAll = productTypesData.items.length === checkedList.length;
    const indeterminate =
        checkedList.length > 0 &&
        checkedList.length < productTypesData.items.length;

    const handleChangeCheckedList = (list: string[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        if (e.target.checked) {
            // Khi chọn tất cả, thêm các checkbox chưa bị disable vào danh sách hiện tại
            const enabledProductTypeIds = productTypesData?.items
                .filter((item) => !getDisabledCheckbox(item.id))
                .map((item) => item.id);
            const currentDisabledIds = checkedList.filter((id) =>
                productTypesData?.items.find(
                    (item) => item.id === id && getDisabledCheckbox(id)
                )
            );
            setCheckedList([...currentDisabledIds, ...enabledProductTypeIds]);
        } else {
            // Khi bỏ chọn tất cả, chỉ giữ lại các checkbox đã bị disable
            const disabledProductTypeIds = productTypesData?.items
                .filter((item) => getDisabledCheckbox(item.id))
                .map((item) => item.id);
            setCheckedList(disabledProductTypeIds);
        }
    };

    const handleCreateOrder = async (value: any) => {
        try {
            active();
            const {
                type,
                descriptionvideo,
                descriptionimage,
                descriptionsource,
                illustrativeImage,
                code,
                ...resData
            } = value;
            const fileData: OrderPayload['illustrativeImageList'] = [];

            if (illustrativeImage?.fileList.length > 0) {
                for (const item of illustrativeImage?.fileList || []) {
                    const currentFile = item?.originFileObj;
                    const fileNameSplit = currentFile.name.split('.');
                    const extension = fileNameSplit.pop();
                    const fileName = fileNameSplit.join('.');

                    const fileId = await uploadApi.uploadFileToDriveV2(
                        currentFile,
                        GOOGLE_ILLUSTRATIVE_FOLDER_ID
                    );
                    const fileDataItem = {
                        key: '',
                        contentType: currentFile.type,
                        extension,
                        fileSizeInByte: currentFile.size,
                        fileName,
                        googleDriveFileId: fileId,
                    };

                    fileData.push(fileDataItem);
                }
            }
            const variables: CreateOrder = {
                payload: {
                    dataOrder: {
                        ...resData,
                        topicId: value.code,
                        illustrativeImageList: fileData,
                    },
                    dataOrderProduct: checkedList.map((productTypeId) => {
                        const productType = productTypesData?.items.find(
                            (item) => item.id === productTypeId
                        );

                        const descriptionName = `description${productType?.code}`;
                        const descriptionValue = value[descriptionName];

                        return {
                            description: descriptionValue,
                            productTypeId: productTypeId,
                        };
                    }),
                },

                onSuccess: () => {
                    form.resetFields();
                    setCheckedList([]);
                    useOrderUpdateStore.setState({
                        hasNewData: true,
                        lastUpdatedTime: Date.now(),
                    });
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
            createOrder(variables);
        } catch (error) {
            deActive();
        }
    };

    const handleUpdateOrder = async (value: any) => {
        try {
            active();
            const { type, illustrativeImage, code, ...resData } = value;

            const currentIllustrativeImageList = dataEdit?.orderIllustrative;

            const illustrativeImageIdListRemove = illustrativeImage?.fileList;
            const removedIllustrativeImageIdList: string[] = [];
            currentIllustrativeImageList?.forEach((originalImage) => {
                const originalUrl = originalImage.fileInfor?.readUrl;

                const stillExists = illustrativeImageIdListRemove.some(
                    (newImage: any) => newImage.url === originalUrl
                );

                if (!stillExists) {
                    removedIllustrativeImageIdList.push(originalImage.fileId);
                }
            });

            const fileData: OrderPayload['illustrativeImageList'] = [];
            if (illustrativeImage?.fileList.length > 0) {
                for (const item of illustrativeImage?.fileList || []) {
                    const currentFile = item?.originFileObj;
                    if (currentFile) {
                        const fileId = await uploadApi.uploadFileToDriveV2(
                            currentFile,
                            GOOGLE_ILLUSTRATIVE_FOLDER_ID
                        );
                        const fileDataItem = {
                            key: '',
                            contentType: currentFile.type,
                            extension: currentFile.name.split('.').pop(),
                            fileSizeInByte: currentFile.size,
                            fileName: currentFile.name,
                            googleDriveFileId: fileId,
                        };

                        fileData.push(fileDataItem);
                    }
                }
            }

            const variables: UpdateOrder = {
                payload: {
                    dataOrder: {
                        ...resData,
                        id: dataEdit!.id,
                        deadline: value.deadline.valueOf(),
                        illustrativeImageList: fileData,
                        illustrativeImageIdListRemove:
                            removedIllustrativeImageIdList,
                        topicId:
                            value.code == dataEdit?.code
                                ? dataEdit?.topicId
                                : value.code,
                    },
                    dataOrderProduct: checkedList.map((productTypeId) => {
                        const productType = productTypesData?.items.find(
                            (item) => item.id === productTypeId
                        );

                        const descriptionName = `description${productType?.code}`;
                        const descriptionValue = value[descriptionName];

                        return {
                            description: descriptionValue,
                            productTypeId: productTypeId,
                        };
                    }),
                },
                onSuccess: () => {
                    onClose();
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

            updateOrder(variables);
        } catch (error) {
            deActive();
        }
    };

    const onFinish = (value: OrderData) => {
        return isCreateForm
            ? handleCreateOrder(value)
            : handleUpdateOrder(value);
    };

    const renderDynamicDescriptionField = () => {
        return checkedList.map((productTypeId) => {
            const productType = productTypesData?.items.find(
                (productType) => productType.id === productTypeId
            );
            if (!productType) return null;

            const label =
                messages('common.description') +
                ` ${
                    locale === LOCALE.EN
                        ? productType.nameEn.toLocaleLowerCase()
                        : productType.nameVi.toLocaleLowerCase()
                }`;

            const name = `description${productType?.code}`;

            return (
                <AppFormItem
                    key={productTypeId}
                    name={name}
                    label={label}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TextArea
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        readOnly={disabledForm}
                    />
                </AppFormItem>
            );
        });
    };

    useEffect(() => {
        const imageDescription = dataEdit?.orderProduct?.find(
            (item) => item.productType.code === PRODUCT_TYPE.IMAGE
        );

        const videoDescription = dataEdit?.orderProduct?.find(
            (item) => item.productType.code === PRODUCT_TYPE.VIDEO
        );

        const sourceDescription = dataEdit?.orderProduct?.find(
            (item) => item.productType.code === PRODUCT_TYPE.SOURCE
        );

        const initialValues = dataEdit
            ? {
                  ...dataEdit,
                  deadline: dayjs(dataEdit.deadline),
                  topicId: dataEdit.topic?.id,
                  priorityId: dataEdit.priority?.id,
                  descriptionimage: imageDescription?.description,
                  descriptionvideo: videoDescription?.description,
                  descriptionsource: sourceDescription?.description,
                  illustrativeImage: dataEdit.orderIllustrative
                      ? {
                            fileList: [
                                ...dataEdit.orderIllustrative.map((item) => {
                                    const { fileInfor } = item;
                                    return {
                                        uid: item.fileId,
                                        thumbUrl: getLinkIllustrative(
                                            fileInfor?.googleDriveFileId,
                                            fileInfor?.readUrl
                                        ),
                                        url: getLinkIllustrative(
                                            fileInfor?.googleDriveFileId,
                                            fileInfor?.readUrl
                                        ),
                                        name: fileInfor?.fileName,
                                    };
                                }),
                            ],
                        }
                      : { orderCount: 1 },
              }
            : {};
        form.setFieldsValue(initialValues);
    }, [JSON.stringify(dataEdit)]);

    return (
        <AppModal
            {...props}
            title={modalTitle}
            onOk={form.submit}
            cancelButtonProps={{ disabled: isActive }}
            confirmLoading={isActive}
            footer={disabledForm ? null : undefined}
            width={800}
            style={{ top: '0.5rem' }}
            loading={isFetching}
        >
            <AppForm
                form={form}
                layout="horizontal"
                showSubmit={false}
                onFinish={onFinish}
                disabled={isActive}
            >
                <AppFormItem
                    name="code"
                    label={messages('common.code')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <TopicSelect
                        data={topicData}
                        className={cn('w-full', {
                            'pointer-events-none': disabledForm,
                        })}
                    />
                </AppFormItem>

                <AppFormItem
                    name="type"
                    label={messages('productType.label')}
                    required
                    rules={[
                        {
                            validator: (_, value) => {
                                // if (isUpdate) return Promise.resolve();
                                if (checkedList.length === 0) {
                                    return Promise.reject(
                                        new Error(messages('validation.select'))
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {/* <TypeSelect
                        style={{ width: '100%' }}
                        className={cn('w-full', {
                            'pointer-events-none': disabledForm,
                        })}
                    /> */}
                    <div>
                        <Checkbox
                            disabled={isActive || disabledForm}
                            indeterminate={indeterminate}
                            checked={checkAll}
                            onChange={onCheckAllChange}
                        >
                            {messages('common.all')}
                        </Checkbox>
                        <Checkbox.Group
                            disabled={isActive}
                            value={checkedList}
                            onChange={handleChangeCheckedList}
                        >
                            {productTypesData.items.map((option) => (
                                <Checkbox
                                    key={option.id}
                                    value={option.id}
                                    disabled={getDisabledCheckbox(option.id)}
                                >
                                    {locale === LOCALE.EN
                                        ? option.nameEn
                                        : option.nameVi}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </div>
                </AppFormItem>

                {renderDynamicDescriptionField()}

                <AppFormItem
                    name="priorityId"
                    label={messages('priority.label')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <PrioritySelect
                        style={{ width: '100%' }}
                        className={cn('w-full', {
                            'pointer-events-none': disabledForm,
                        })}
                    />
                </AppFormItem>

                <AppFormItem
                    name="deadline"
                    label={messages('common.deadline')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                    className="w-full"
                >
                    <DatePicker
                        format={DATE_FORMAT.DATE_MINUTE}
                        showTime
                        className="w-full"
                        placement="topLeft"
                        disabledDate={disabledDateTime.disabledDate}
                        disabledTime={disabledDateTime.disabledTime}
                        style={{
                            pointerEvents: disabledForm ? 'none' : 'auto',
                        }}
                    />
                </AppFormItem>

                {isCreateForm && (
                    <AppFormItem
                        name="orderCount"
                        initialValue={1}
                        label={messages('order.orderQuantityCreate')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                type: 'number',
                                min: 1,
                                message: messages('validation.numberMin', {
                                    number: 1,
                                }),
                            },
                            {
                                type: 'number',
                                max: 100,
                                message: messages('validation.numberMax', {
                                    number: 100,
                                }),
                            },
                        ]}
                    >
                        <InputNumber
                            defaultValue={1}
                            style={{ width: '100%' }}
                        />
                    </AppFormItem>
                )}

                {!isCreateForm && isAdmin && (
                    <AppFormItem
                        name="status"
                        label={messages('common.status')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <StatusSelect
                            style={{ width: '100%' }}
                            className={cn('w-full', {
                                'pointer-events-none': disabledForm,
                            })}
                        />
                    </AppFormItem>
                )}

                {/* <AppFormItem
                    name="content"
                    label={messages('common.description')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TextArea
                        allowClear
                        // maxLength={100}
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        readOnly={disabledForm}
                    />
                </AppFormItem> */}

                <AppFormItem
                    name="client"
                    label={messages('common.client')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>

                <AppFormItem
                    name="source"
                    label={'Source'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>

                {/* <AppFormItem
                    name="thumbnail"
                    label={'Thumbnail'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <TextArea allowClear />
                </AppFormItem> */}
                <AppFormItem
                    name="researchFile"
                    label={`File ${messages('common.reSearch')}`}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input allowClear />
                </AppFormItem>

                <AppFormItem
                    name="motion"
                    label={`${messages('common.motion')}`}
                >
                    <Input allowClear />
                </AppFormItem>

                {typeModal !== TYPE_MODAL_ORDER.DETAIL && (
                    <AppFormItem
                        name="illustrativeImage"
                        label={messages('order.illustrativeImage')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.image'),
                            },
                        ]}
                    >
                        <ImageListUpload
                            maxCount={10}
                            accept="image/*"
                            disabled={disabledForm || isActive}
                        />
                    </AppFormItem>
                )}

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
                        allowClear
                        autoSize={{ minRows: 3, maxRows: 7 }}
                        readOnly={disabledForm}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
