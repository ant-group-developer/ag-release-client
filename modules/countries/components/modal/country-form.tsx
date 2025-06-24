import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { CountryData } from '../../types';

type Props = Omit<AppModalProps, 'children'> & {};

export default function CountryFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as CountryData);

    useEffect(() => {
        const initialData = {
            ...dataEdit,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit]);

    return (
        <AppModal
            width={600}
            {...props}
            title={messages('common.create') + ' Quốc gia'}
            open
            onCancel={closeModal}
            onOk={form.submit}
        >
            <AppForm form={form} showSubmit={false} layout="vertical">
                <AppFormItem
                    name="name"
                    label="Tên quốc gia"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên quốc gia',
                        },
                    ]}
                >
                    {' '}
                    <Input placeholder="Tên quốc gia" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="iso3"
                    label="ISO3"
                    required
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã ISO3' },
                    ]}
                >
                    {' '}
                    <Input placeholder="ISO3" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="iso2"
                    label="ISO2"
                    required
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã ISO2' },
                    ]}
                >
                    {' '}
                    <Input placeholder="ISO2" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="numeric_code"
                    label="Mã số"
                    required
                    rules={[{ required: true, message: 'Vui lòng nhập mã số' }]}
                >
                    {' '}
                    <Input placeholder="Mã số" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="phoneCode"
                    label="Mã điện thoại"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mã điện thoại',
                        },
                    ]}
                >
                    {' '}
                    <Input placeholder="Mã điện thoại" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="capital"
                    label="Thủ đô"
                    required
                    rules={[
                        { required: true, message: 'Vui lòng nhập thủ đô' },
                    ]}
                >
                    {' '}
                    <Input placeholder="Thủ đô" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="currency"
                    label="Tiền tệ"
                    required
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiền tệ' },
                    ]}
                >
                    {' '}
                    <Input placeholder="Tiền tệ" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="currencyName"
                    label="Tên tiền tệ"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tiền tệ',
                        },
                    ]}
                >
                    {' '}
                    <Input placeholder="Tên tiền tệ" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="currencySymbol"
                    label="Ký hiệu tiền tệ"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập ký hiệu tiền tệ',
                        },
                    ]}
                >
                    {' '}
                    <Input placeholder="Ký hiệu tiền tệ" allowClear />{' '}
                </AppFormItem>
                <AppFormItem
                    name="nationality"
                    label="Quốc tịch"
                    required
                    rules={[
                        { required: true, message: 'Vui lòng nhập quốc tịch' },
                    ]}
                >
                    {' '}
                    <Input placeholder="Quốc tịch" allowClear />{' '}
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
