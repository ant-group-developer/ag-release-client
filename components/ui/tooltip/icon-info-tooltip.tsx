import { SIZE_ICON } from '@/constants/common';
import { Info } from 'lucide-react';
import CustomTooltip, { CustomTooltipProps } from './custom-tooltip';

type Props = CustomTooltipProps & {};

export default function IconInfoTooltip({ ...props }: Props) {
    return (
        <CustomTooltip {...props}>
            <Info size={SIZE_ICON} className="cursor-pointer" />
        </CustomTooltip>
    );
}
