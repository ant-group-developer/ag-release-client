import { Badge, Segmented } from 'antd';

import { getIntlCodeByDistributionStatus } from '@/helpers/intl';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useTranslations } from 'next-intl';
import { DISTRIBUTION_STATUS } from '../../enum';
import { DistributionDataFilter } from '../../types';

type Props = {
    onChangeFilter: OnChangeFilter<DistributionDataFilter>;
    value: DISTRIBUTION_STATUS | undefined;
};

export default function DistributionStatus({ onChangeFilter, value }: Props) {
    const messages = useTranslations();

    const handleChangeStatus = (status: DISTRIBUTION_STATUS) => {
        onChangeFilter({ status });
    };

    return (
        <div className="flex items-center gap-2 p-4 py-2">
            <Segmented
                options={Object.values(DISTRIBUTION_STATUS).map(
                    (item, index) => ({
                        label: (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {messages(
                                        getIntlCodeByDistributionStatus(item)
                                    )}
                                </span>
                                <Badge
                                    color={item === value ? 'blue' : '#ccc'}
                                    count={index + 1}
                                />
                            </div>
                        ),
                        value: item,
                    })
                )}
                value={value}
                onChange={(value) => handleChangeStatus(value)}
            />
        </div>
    );
}
