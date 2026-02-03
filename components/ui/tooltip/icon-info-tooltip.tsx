import { SIZE_ICON } from '@/constants/common';
import { CircleQuestionMark } from 'lucide-react';
import CustomTooltip, { CustomTooltipProps } from './custom-tooltip';

type Props = CustomTooltipProps & {};

export default function IconInfoTooltip({ ...props }: Props) {
    return (
        <CustomTooltip {...props}>
            <div className="flex h-full items-center justify-center">
                <CircleQuestionMark
                    size={SIZE_ICON}
                    className="cursor-pointer text-gray-400"
                />
            </div>
        </CustomTooltip>
    );
}
