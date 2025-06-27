import { Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = Omit<SelectProps, 'options'> & {};

export default function YoutubePolicySelect({ ...props }: Props) {
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
            value: 'track in all countries',
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

    return (
        <Select
            options={youtubeOptions}
            defaultValue="Monetize in all"
            className="w-full"
            {...props}
        />
    );
}
