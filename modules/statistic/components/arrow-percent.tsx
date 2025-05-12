import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { ArrowDown, ArrowUp } from 'lucide-react';

type Props = {
    comparePercent: number;
    isReverse?: boolean;
    reverseColors?: boolean;
};

export default function ArrowPercent({
    comparePercent,
    isReverse = false,
    reverseColors = false,
}: Props) {
    const renderArrow = () => {
        if (isReverse) {
            return comparePercent > 0 ? (
                <ArrowDown size={SIZE_ICON} />
            ) : comparePercent < 0 ? (
                <ArrowUp size={SIZE_ICON} />
            ) : (
                <div className="w-[18px]"></div>
            );
        }
        return comparePercent > 0 ? (
            <ArrowUp size={SIZE_ICON} />
        ) : comparePercent < 0 ? (
            <ArrowDown size={SIZE_ICON} />
        ) : (
            <div className="w-[18px]"></div>
        );
    };

    return (
        <span
            className={cn('flex items-center', {
                'text-green-500': reverseColors
                    ? comparePercent < 0
                    : comparePercent > 0,
                'text-red-500': reverseColors
                    ? comparePercent > 0
                    : comparePercent < 0,
                'text-zinc-500': comparePercent == 0,
            })}
        >
            <span className="flex items-center justify-start text-left">
                {renderArrow()}
                {Math.abs(comparePercent)}%
            </span>
        </span>
    );
}
