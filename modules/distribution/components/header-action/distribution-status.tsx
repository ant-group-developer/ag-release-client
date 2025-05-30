import { Badge } from 'antd';

import { cn } from '@/helpers/common';
import { getIntlCodeByDistributionStatus } from '@/helpers/intl';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DISTRIBUTION_STATUS } from '../../enum';
import { DistributionDataFilter } from '../../types';

type Props = {
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
    value: DISTRIBUTION_STATUS | undefined;
};

export default function DistributionStatus({ onChangeFilter, value }: Props) {
    const messages = useTranslations();
    const [status, setStatus] = useState<DISTRIBUTION_STATUS>(
        value || DISTRIBUTION_STATUS.PROGRESS
    );

    const handleChangeStatus = (status: DISTRIBUTION_STATUS) => {
        setStatus(status);
        onChangeFilter({ status });
    };

    return (
        <div className="flex items-center gap-2 p-4 py-2">
            {Object.values(DISTRIBUTION_STATUS).map((item, index) => {
                return (
                    <Button
                        key={index}
                        type="text"
                        className={cn(
                            '!rounded-2xl hover:!bg-card-bg-hover',
                            (value || DISTRIBUTION_STATUS.PROGRESS) === item &&
                                '!bg-card-bg-hover'
                        )}
                        onClick={() => handleChangeStatus(item)}
                    >
                        <span className="font-medium">
                            {messages(getIntlCodeByDistributionStatus(item))}
                        </span>
                        <Badge color="blue" count={index + 1} />
                    </Button>
                );
            })}
        </div>
    );
}
