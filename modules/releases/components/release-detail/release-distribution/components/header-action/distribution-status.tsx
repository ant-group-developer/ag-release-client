import { Badge, Segmented } from 'antd';

import { getIntlCodeByDistributionStatus } from '@/helpers/intl';
import { OnChangeFilter } from '@/hooks/use-filter';
import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import { useTranslations } from 'next-intl';

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
        <div className="flex w-full items-center gap-2 rounded-lg bg-white p-4 py-2">
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
                                    className="custom-medium-badge"
                                    color={item === value ? 'blue' : '#ccc'}
                                    count={index === 0 ? '20' : index + 1}
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
