import { Badge, Segmented, theme } from 'antd';

import { getIntlCodeByReleaseDspDeliveryStatus } from '@/helpers/intl';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { useTranslations } from 'next-intl';

type Props = {
    onChangeStatus: (status: RELEASE_DSP_DELIVERY_STATUS | undefined) => void;
    value: RELEASE_DSP_DELIVERY_STATUS | undefined;
};

export default function DistributionStatus({ onChangeStatus, value }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const handleChangeStatus = (
        status: RELEASE_DSP_DELIVERY_STATUS | 'all'
    ) => {
        onChangeStatus(status === 'all' ? undefined : status);
    };

    const options = [
        {
            label: (
                <div className="flex items-center gap-2">
                    <span className="font-medium">
                        {messages('common.all')}
                    </span>
                    <Badge
                        className="custom-medium-badge"
                        color={value === undefined ? 'blue' : '#ccc'}
                    />
                </div>
            ),
            value: 'all',
        },
        ...Object.values(RELEASE_DSP_DELIVERY_STATUS).map((item, index) => ({
            label: (
                <div className="flex items-center gap-2">
                    <span className="font-medium">
                        {messages(getIntlCodeByReleaseDspDeliveryStatus(item))}
                    </span>
                    <Badge
                        className="custom-medium-badge"
                        color={item === value ? 'blue' : '#ccc'}
                        // count={index === 0 ? '20' : index + 1}
                    />
                </div>
            ),
            value: item,
        })),
    ];

    return (
        <div
            className="flex w-full items-center gap-2 rounded-lg"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            <Segmented
                options={options}
                value={value ?? 'all'}
                onChange={(value) =>
                    handleChangeStatus(
                        value as RELEASE_DSP_DELIVERY_STATUS | 'all'
                    )
                }
            />
        </div>
    );
}
