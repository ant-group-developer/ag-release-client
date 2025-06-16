import { Avatar, Select, SelectProps } from 'antd';
import { ReactNode } from 'react';
import { CustomTooltipProps } from '../tooltip/custom-tooltip';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = {
    selectProps?: SelectProps;
    title: string;
    tooltipInfo?: ReactNode;
    avatarSrc?: string;
    tooltipProps?: CustomTooltipProps;
    options: SelectProps['options'];
};

export default function CustomSelectIcon({
    selectProps,
    title,
    tooltipInfo,
    avatarSrc,
    tooltipProps,
    options,
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
                <IconInfoTooltip {...tooltipProps} title={tooltipInfo} />
            </div>
            <Select {...selectProps} options={options} />
        </div>
    );
}
