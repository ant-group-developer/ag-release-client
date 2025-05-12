import { calculateComparePercent } from '@/helpers/common';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export interface CompareTooltipProps {
    current: number;
    previous: number;
    startDate: string;
    endDate: string;
    prevStartDate: string;
    prevEndDate: string;
}

const CompareTooltip: FC<CompareTooltipProps> = ({
    current,
    previous,
    startDate,
    endDate,
    prevStartDate,
    prevEndDate,
}) => {
    const messages = useTranslations();
    const percent = calculateComparePercent(current, previous);

    // lấy đúng key tăng/giảm
    const key =
        percent >= 0
            ? 'statistic.increaseComparePercent'
            : 'statistic.decreaseComparePercent';

    // build nội dung tooltip
    const title = (
        <div>
            <p>{messages(key, { value: Math.abs(percent) })}</p>
            <p>
                {startDate} – {endDate}: {current}
            </p>
            <p>
                {prevStartDate} – {prevEndDate}: {previous}
            </p>
        </div>
    );

    return <div>{title}</div>;
};

export default CompareTooltip;
