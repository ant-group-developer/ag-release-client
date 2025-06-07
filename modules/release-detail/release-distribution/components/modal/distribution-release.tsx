import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CustomSelectIcon from '@/components/ui/select/custom-select-icon';
import RegionSelect from '@/components/ui/select/region-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import AppTable from '@/components/ui/table/normal-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import useModalStore from '@/hooks/use-modal';
import { distributionData } from '@/modules/distribution/constants';
import { DatePicker } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Key, useState } from 'react';

type Props = Omit<AppModalProps, 'children'> & {
    platformIds: Key[];
};

export default function DistributionReleaseModal({
    platformIds,
    ...props
}: Props) {
    const messages = useTranslations();
    const dataEdit = useModalStore((state) => state.dataEdit);
    const initialSelectedKeys = dataEdit ? [dataEdit.id] : platformIds;
    const [selectedRow, setSelectedRow] = useState<Key[]>(
        initialSelectedKeys || []
    );
    const [form] = useForm();
    const closeModal = useModalStore((state) => state.closeModal);

    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedRow,
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

    const dataTable = dataEdit
        ? distributionData?.filter((item) => item.id === dataEdit.id)
        : distributionData.filter((item) => {
              return platformIds.includes(item.id);
          });

    const facebookOptions = [
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Claim Ad Earnings</span>
                    <IconInfoTooltip title=" Quét tất cả video/câu chuyện sử dụng nhạc của bạn và bật kiếm tiền (nhận tiền bản quyền)" />
                </p>
            ),
            value: 'Claim Ad Earnings',
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Block</span>
                    <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn và chặn chúng." />
                </p>
            ),
            value: 'Block',
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Monitor</span>
                    <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn nhưng không bật kiếm tiền. Chỉ thu thập dữ liệu phân tích." />
                </p>
            ),
            value: 'Monitor',
        },
    ];

    const tiktokOptions = [
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>NoTiktokScanning</span>
                    <IconInfoTooltip title="Không quét TikTok để tìm các video chứa nhạc của bạn vì bản thu này không đáp ứng đầy đủ các yêu cầu (xem Thuộc tính bản nhạc). Lưu ý rằng nhạc của bạn vẫn sẽ có sẵn để người dùng TikTok thêm vào video của họ." />
                </p>
            ),
            value: 'NoTiktokScanning',
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Block</span>
                    <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn và chặn chúng." />
                </p>
            ),
            value: 'Block',
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Monetize</span>
                    <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và bật kiếm tiền cho chúng (nhận tiền bản quyền)." />
                </p>
            ),
            value: 'Monitor',
        },
    ];

    const youtubeOptions = [
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Monetize in all countries</span>
                    <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và bật kiếm tiền cho chúng (nhận tiền bản quyền)." />
                </p>
            ),
            value: 'Monetize in all',
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Track in all countries</span>
                    <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn nhưng không bật kiếm tiền. Chỉ thu thập dữ liệu phân tích về chúng." />
                </p>
            ),
            value: 'rack in all countries',
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>Block in all countries</span>
                    <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và chặn chúng." />
                </p>
            ),
            value: 'Block in all countries',
        },
    ];

    const amazonOptions = [
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>$0.6</span>
                    <span>Back</span>
                </p>
            ),
            value: 0.6,
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>$0.8</span>
                    <span>Mid</span>
                </p>
            ),
            value: 0.8,
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>$1.2</span>
                    <span>Front</span>
                </p>
            ),
            value: 1.2,
        },
    ];

    const appleMusicOptions = [
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>$0.6</span>
                    <span>Back</span>
                </p>
            ),
            value: 0.6,
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>$0.8</span>
                    <span>Mid</span>
                </p>
            ),
            value: 0.8,
        },
        {
            label: (
                <p className="flex items-center justify-between">
                    <span>$1.2</span>
                    <span>Front</span>
                </p>
            ),
            value: 1.2,
        },
    ];

    return (
        <AppModal
            open
            {...props}
            width={'80vw'}
            height={800}
            title="Phân phối bản phát hành"
            onCancel={closeModal}
            maskClosable={false}
            className="!top-5"
        >
            <AppForm form={form} layout="vertical" showSubmit={false}>
                <div className="flex flex-col gap-y-8">
                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-500">
                            Chọn nền tảng
                        </p>
                        <AppTable
                            columns={column}
                            dataSource={dataTable}
                            rowSelection={rowSelection}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-500">
                            Cài đặt UGC nền tảng phát hành
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            <AppFormItem
                                label="Chính sách kiếm tiền facebook"
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
                                    title="Facebook Rights Manager"
                                    tooltipInfo="Xem mô tả các chính sách kiếm tiền facebook ở ô chọn"
                                    avatarSrc="https://images.vexels.com/content/137253/preview/facebook-icon-logo-205182.png"
                                    tooltipProps={{
                                        overlayClassName: 'w-tooltip-300',
                                    }}
                                    options={facebookOptions}
                                />
                            </AppFormItem>
                            <AppFormItem
                                label="Chính sách kiếm tiền Tiktok"
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
                                    title="Tiktok"
                                    tooltipInfo="Xem mô tả các chính sách kiếm tiền Tiktok ở ô chọn"
                                    avatarSrc="https://www.citypng.com/public/uploads/preview/round-tiktok-icon-logo-transparent-background-701751695033010oraha4pc0r.png"
                                    options={tiktokOptions}
                                />
                            </AppFormItem>
                            <AppFormItem
                                label="Chính sách kiếm tiền Tiktok"
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
                                    title="Youtube Content ID"
                                    tooltipInfo="Xem mô tả các chính sách kiếm tiền youtube ở ô chọn"
                                    avatarSrc="https://static.vecteezy.com/system/resources/thumbnails/018/930/575/small_2x/youtube-logo-youtube-icon-transparent-free-png.png"
                                    options={youtubeOptions}
                                />
                            </AppFormItem>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-500">
                            Cài đặt cửa hàng Tải xuống
                        </p>
                        <div className="grid grid-cols-3 gap-4">
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
                                    options={amazonOptions}
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
                                    options={appleMusicOptions}
                                />
                            </AppFormItem>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-base font-bold text-gray-500">
                            Cài đặt lịch & lãnh thổ phát hành
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                {/* <AppFormItem label="Ngày phát hành">
                                    <Radio.Group>
                                        <Radio value={true}>
                                            Sớm nhất có thể
                                        </Radio>
                                        <Radio value={false}>
                                            Thời điểm cụ thể
                                        </Radio>
                                    </Radio.Group>
                                </AppFormItem> */}
                                <AppFormItem
                                    label="Ngày phát hành sản phẩm"
                                    name="releaseDate"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        format="YYYY-MM-DD"
                                    />
                                </AppFormItem>

                                <AppFormItem
                                    label="Ngày đặt trước sản phẩm"
                                    name="preOrderDate"
                                >
                                    <DatePicker
                                        className="w-full"
                                        format="YYYY-MM-DD"
                                    />
                                </AppFormItem>
                                <AppFormItem
                                    label="Timezone"
                                    name="timezone"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <TimezoneSelect className="w-full" />
                                </AppFormItem>
                            </div>
                            <div>
                                <AppFormItem
                                    label="Loại khu vực"
                                    name="territoryType"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <RegionSelect
                                        multiple
                                        allowClear
                                        maxTagCount="responsive"
                                        maxTagPlaceholder={(value) => (
                                            <CustomTooltip
                                                title={value
                                                    .map(
                                                        (item: any) =>
                                                            item.label
                                                    )
                                                    .join(', ')}
                                            >
                                                +{value.length}
                                            </CustomTooltip>
                                        )}
                                    />
                                </AppFormItem>
                                <AppFormItem label="Ghi chú" name="note">
                                    <TextArea
                                        autoSize={{ minRows: 4, maxRows: 20 }}
                                    />
                                </AppFormItem>
                            </div>
                        </div>
                    </div>
                </div>
            </AppForm>
        </AppModal>
    );
}
