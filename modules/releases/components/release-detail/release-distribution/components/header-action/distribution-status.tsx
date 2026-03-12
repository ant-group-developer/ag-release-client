import { Badge, Segmented, theme } from 'antd';

import { getIntlCodeByDistributionStatus } from '@/helpers/intl';
import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { useTranslations } from 'next-intl';

type Props = {
    onChangeStatus: (status: DISTRIBUTION_STATUS) => void;
    value: DISTRIBUTION_STATUS | undefined;
};

export default function DistributionStatus({ onChangeStatus, value }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const handleChangeStatus = (status: DISTRIBUTION_STATUS) => {
        onChangeStatus(status);
    };

    return (
        <div
            className="flex w-full items-center gap-2 rounded-lg"
            style={{ backgroundColor: token.colorBgContainer }}
        >
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
                                    // count={index === 0 ? '20' : index + 1}
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
