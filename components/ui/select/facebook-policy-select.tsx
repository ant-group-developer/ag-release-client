import { Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = Omit<SelectProps, 'options'> & {};

export default function FacebookPolicySelect({ ...props }: Props) {
    const facebookOptions = [
        {
            label: (
                <p className="flex items-center justify-between gap-1">
                    <span>Claim Ad Earnings</span>
                    <IconInfoTooltip title=" Quét tất cả video/câu chuyện sử dụng nhạc của bạn và bật kiếm tiền (nhận tiền bản quyền)" />
                </p>
            ),
            value: 'Claim Ad Earnings',
        },
        {
            label: (
                <p className="flex items-center justify-between gap-1">
                    <span>Block</span>
                    <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn và chặn chúng." />
                </p>
            ),
            value: 'Block',
        },
        {
            label: (
                <p className="flex items-center justify-between gap-1">
                    <span>Monitor</span>
                    <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn nhưng không bật kiếm tiền. Chỉ thu thập dữ liệu phân tích." />
                </p>
            ),
            value: 'Monitor',
        },
    ];

    return (
        <Select
            options={facebookOptions}
            defaultValue="Claim Ad Earnings"
            className="w-full"
            {...props}
        />
    );
}
