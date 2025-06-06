import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CustomSelectIcon from '@/components/ui/select/custom-select-icon';
import AppTable from '@/components/ui/table/normal-table';
import useModalStore from '@/hooks/use-modal';
import { distributionData } from '@/modules/distribution/constants';
import { useForm } from 'antd/es/form/Form';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Key, useState } from 'react';

type Props = Omit<AppModalProps, 'children'> & {};

export default function DistributionReleaseModal({ ...props }: Props) {
    const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const [form] = useForm();
    const closeModal = useModalStore((state) => state.closeModal);

    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const rowSelection = {
        selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 50,
    };

    const column: ColumnType<any>[] = [
        {
            title: 'Platform',
            dataIndex: 'platform',
            width: 1050,
            render: (value, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <Image
                                src={record?.thumbnail}
                                alt="thumbnail"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold">{value}</span>
                    </div>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 400,
            align: 'left',
            render: (value) => {
                // return <span>{value}</span>;
                return <span>Chưa phát hành</span>;
            },
        },
    ];

    return (
        <AppModal
            open
            {...props}
            footer={false}
            width={'80vw'}
            title="Phân phối bản phát hành"
            onCancel={closeModal}
            maskClosable={false}
        >
            <AppForm form={form} layout="vertical" showSubmit={false}>
                <div className="flex flex-col gap-y-8">
                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-500">
                            Chọn nền tảng
                        </p>
                        <AppTable
                            columns={column}
                            dataSource={distributionData}
                            rowSelection={rowSelection}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-500">
                            Cài đặt cửa hàng Tải xuống
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <AppFormItem
                                label="Giá bán lẻ trên Amazon"
                                name="platform"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <CustomSelectIcon
                                    title="Amazon"
                                    tooltipInfo="Bạn có thể thiết lập giá tuỳ chỉnh cho bản phát hành trên Amazon"
                                    avatarSrc="https://mic.mediacdn.vn/Upload_Moi/2020_vn/20200715-pg5.jpg"
                                />
                            </AppFormItem>
                            <AppFormItem
                                label="Giá bán lẻ trên Apple Music"
                                name="platform"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <CustomSelectIcon
                                    title="Apple Music"
                                    tooltipInfo="Bạn có thể thiết lập giá tuỳ chỉnh cho bản phát hành trên Apple Music"
                                    avatarSrc="https://getnhanh.net/wp-content/uploads/2023/12/tai-khoan-apple-music.png"
                                />
                            </AppFormItem>
                        </div>
                    </div>
                </div>
            </AppForm>
        </AppModal>
    );
}
