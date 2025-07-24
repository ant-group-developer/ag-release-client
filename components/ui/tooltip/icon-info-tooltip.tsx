import { SIZE_ICON } from '@/constants/common';
import { Info } from 'lucide-react';
import CustomTooltip, { CustomTooltipProps } from './custom-tooltip';

type Props = CustomTooltipProps & {};

export default function IconInfoTooltip({ ...props }: Props) {
    return (
        <CustomTooltip {...props}>
            <div className="flex h-full items-center justify-center">
                <Info size={SIZE_ICON} className="cursor-pointer" />
            </div>
        </CustomTooltip>
    );
}
