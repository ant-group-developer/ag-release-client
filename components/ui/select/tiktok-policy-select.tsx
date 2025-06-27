import { Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = Omit<SelectProps, 'options'> & {};

export default function TikTokPolicySelect({ ...props }: Props) {
    const tikTokOptions = [
        {
            label: (
                <p className="flex items-center justify-between gap-1">
                    <span>NoTikTokScanning</span>
                    <IconInfoTooltip title="Không quét TikTok để tìm các video chứa nhạc của bạn vì bản thu này không đáp ứng đầy đủ các yêu cầu (xem Thuộc tính bản nhạc). Lưu ý rằng nhạc của bạn vẫn sẽ có sẵn để người dùng TikTok thêm vào video của họ." />
                </p>
            ),
            value: 'NoTikTokScanning',
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
                    <span>Monetize</span>
                    <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và bật kiếm tiền cho chúng (nhận tiền bản quyền)." />
                </p>
            ),
            value: 'Monetize',
        },
    ];
    return (
        <Select
            options={tikTokOptions}
            defaultValue="Monetize"
            className="w-full"
            {...props}
        />
    );
}
