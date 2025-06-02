import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { Button, Form, Input } from 'antd';
import { Copy, SquareArrowOutUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    open: boolean;
    onClose: () => void;
    platformData: any;
};

export default function LinkProfileArtist({
    open,
    onClose,
    platformData,
}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        console.log(values);
        onClose();
    };

    return (
        <AppModal
            open={open}
            title={`Liên kết hồ sơ nghệ sĩ ${platformData?.name}`}
            onCancel={onClose}
            footer={false}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        >
            <AppForm form={form} layout="vertical" onFinish={handleSubmit}>
                <AppFormItem
                    name="appleArtistId"
                    label={`ID nghệ sĩ`}
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Artist Apple ID',
                        },
                    ]}
                >
                    <div className="flex items-center gap-1">
                        <Input placeholder="e.g. 1249595" />
                        <CustomTooltip title={messages('common.copy')}>
                            <Button
                                className="!px-2"
                                type="primary"
                                icon={
                                    <div>
                                        <Copy size={SIZE_ICON} />
                                    </div>
                                }
                            />
                        </CustomTooltip>
                        <CustomTooltip title={messages('common.test')}>
                            <Button
                                className="!px-2"
                                type="primary"
                                icon={
                                    <div>
                                        <SquareArrowOutUpRight
                                            size={SIZE_ICON}
                                        />
                                    </div>
                                }
                            />
                        </CustomTooltip>
                    </div>
                </AppFormItem>
                <div className="mt-2 text-sm text-gray-500">
                    {`Vào trang hồ sơ nghệ sĩ của bạn trên ${platformData?.name} và sao chép-dán phần số của URL. Ví dụ: 1249595`}
                </div>
            </AppForm>
        </AppModal>
    );
}
