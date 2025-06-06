import { Avatar, Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = {
    selectProps?: SelectProps;
    title: string;
    tooltipInfo?: string;
    avatarSrc?: string;
};

export default function CustomSelectIcon({
    selectProps,
    title,
    tooltipInfo,
    avatarSrc,
}: Props) {
    return (
        <div className="space-y-2 rounded-lg border p-2">
            <div className="flex items-center gap-2">
                {avatarSrc && (
                    <Avatar
                        size={32}
                        src={avatarSrc}
                        // src=""
                    />
                )}
                <span className="font-bold">{title}</span>
                <IconInfoTooltip
                    title={tooltipInfo}
                    // title="Bạn có thể thiết lập giá tuỳ chỉnh cho bản phát hành trên Amazon"
                />
            </div>
            <Select
                options={[
                    {
                        title: '$0.67',
                        value: 0.67,
                    },
                    {
                        title: '$0.99',
                        value: 0.99,
                    },
                    {
                        title: '$1.2',
                        value: 1.2,
                    },
                ]}
                {...selectProps}
            />
        </div>
    );
}
