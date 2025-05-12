import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import StatusSelect from '@/components/ui/select/status-select';
import { DATE_FORMAT, LOCALE } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { ProductData } from '@/modules/product/types';
import { Checkbox, DatePicker, Form, Image, Input, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { getLinkIllustrative } from '../helpers/get-link-illustrative';
import { useGetDetailOrder } from '../hooks/use-detail-order';
import { OrderData } from '../types';

type Props = {
    orderId: OrderData['id'] | undefined;
} & Omit<AppModalProps, 'children'>;

export default function OrderDetail({ orderId, onClose, ...props }: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);

    const { data, isLoading } = useGetDetailOrder(orderId);
    const modalTitle = messages('order.detailOrder') + ` ${data.code}`;
    const isHasIllustrativeImage = data.orderIllustrative.length > 0;
    const dataEdit = useModalStore((state) => state.dataEdit as ProductData);

    useEffect(() => {
        const initialValues = data
            ? {
                  ...data,
                  deadline: dayjs(data.deadline),
                  type: data?.orderProduct,
                  status: dataEdit?.status ?? data.status,
              }
            : {};
        form.setFieldsValue(initialValues);
    }, [JSON.stringify(data)]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <Spin size="default" />
            </div>
        );
    }

    return (
        <AppModal
            {...props}
            title={modalTitle}
            onCancel={closeModal}
            width={750}
            footer={null}
            style={{ top: '3rem' }}
            cancelButtonProps={{ disabled: isLoading }}
        >
            <AppForm form={form} layout="horizontal" showSubmit={false}>
                <AppFormItem
                    name="code"
                    label={messages('common.code')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input readOnly />
                </AppFormItem>
                <AppFormItem
                    name="type"
                    label={messages('productType.label')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    {/* <TypeSelect
                        style={{ width: '100%' }}
                        className="pointer-events-none"
                    /> */}
                    <div>
                        {data?.orderProduct?.map((option) => (
                            <Checkbox
                                key={option.id}
                                value={option.id}
                                checked={true}
                            >
                                {locale === LOCALE.EN
                                    ? option.productType.nameEn
                                    : option.productType.nameVi}
                            </Checkbox>
                        ))}
                    </div>
                </AppFormItem>
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
                        className="pointer-events-none"
                    />
                </AppFormItem>

                {data?.content && (
                    <AppFormItem
                        name="content"
                        label={messages('common.content')}
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
                            autoSize={{ minRows: 7, maxRows: 15 }}
                            readOnly
                        />
                    </AppFormItem>
                )}

                {data?.orderProduct &&
                    data?.orderProduct.length > 0 &&
                    data?.orderProduct.map((item) => {
                        const descriptionName =
                            locale === LOCALE.EN
                                ? item.productType.nameEn
                                : item.productType.nameVi;

                        if (!item.description) return null;
                        return (
                            <AppFormItem
                                key={item.id}
                                label={
                                    messages('common.description') +
                                    ` ${descriptionName.toLowerCase()}`
                                }
                            >
                                <TextArea
                                    allowClear
                                    autoSize={{ minRows: 3, maxRows: 10 }}
                                    readOnly
                                    value={item.description}
                                />
                            </AppFormItem>
                        );
                    })}

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
                        className="pointer-events-none w-full"
                        placement="topLeft"
                    />
                </AppFormItem>

                {isHasIllustrativeImage && (
                    <AppFormItem
                        name="illustrativeImageList"
                        label={messages('order.illustrativeImage')}
                    >
                        <Image.PreviewGroup>
                            <div className="flex flex-wrap gap-2">
                                {data?.orderIllustrative?.map(
                                    ({ fileInfor, file }, index) => (
                                        <Image
                                            key={index}
                                            alt={data.code}
                                            src={getLinkIllustrative(
                                                file.googleDriveFileId,
                                                fileInfor.readUrl
                                            )}
                                            className="h-full max-h-20 w-full rounded-md"
                                            preview={{
                                                maskClassName: 'rounded-md',
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </Image.PreviewGroup>
                    </AppFormItem>
                )}

                <AppFormItem name="note" label={messages('common.note')}>
                    <TextArea
                        allowClear
                        autoSize={{ minRows: 5, maxRows: 7 }}
                        readOnly
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
