import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/tailwind';
import { CircleQuestionMark } from 'lucide-react';
import CustomTooltip, { CustomTooltipProps } from './custom-tooltip';

type Props = CustomTooltipProps & {
    iconClassName?: string;
};

export default function IconInfoTooltip({ iconClassName, ...props }: Props) {
    return (
        <CustomTooltip {...props}>
            <div className="flex h-full items-center justify-center">
                <CircleQuestionMark
                    size={SIZE_ICON}
                    className={cn(
                        'cursor-pointer text-gray-400',
                        iconClassName,
                    )}
                />
            </div>
        </CustomTooltip>
    );
}
