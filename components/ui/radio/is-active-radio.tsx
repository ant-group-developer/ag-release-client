import { ACTIVE_TYPE } from '@/enums/common';
import { TopicActiveCountData } from '@/modules/topic/types';
import { Empty, Radio, RadioProps } from 'antd';
import { useTranslations } from 'next-intl';

interface Props extends RadioProps {
    data: TopicActiveCountData[];
}

export default function IsActiveRadio({ data, ...props }: Props) {
    const messages = useTranslations();

    const typeOptions = data.map((item) => {
        switch (item.name) {
            case true:
                return {
                    value: ACTIVE_TYPE.ON,
                    label: (
                        <div className="flex w-[150px] items-center justify-between">
                            <span>{messages('status.active')}</span>
                            <span>{item.count}</span>
                        </div>
                    ),
                };
            case false:
                return {
                    value: ACTIVE_TYPE.OFF,
                    label: (
                        <div className="flex w-[150px] items-center justify-between">
                            <span className="truncate">
                                {messages('status.block')}
                            </span>
                            <span>{item.count}</span>
                        </div>
                    ),
                };
            default:
                return { value: item.name, label: item.count };
        }
    });

    if (typeOptions.length === 0) return <Empty />;
    return <Radio.Group {...props} options={typeOptions} />;
}
