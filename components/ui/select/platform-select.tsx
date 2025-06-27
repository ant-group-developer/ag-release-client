import { platformList } from '@/constants/fakeData';
import useModalStore from '@/hooks/use-modal';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function PlatformSelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const options: SelectProps['options'] = [
        {
            label: messages('common.all'),
            options: [
                {
                    value: 'ALL',
                    label: messages('common.all'),
                    id: 0,
                },
            ],
        },
        {
            label: messages('common.platforms'),
            options: platformList.map((platform) => ({
                value: platform.id,
                label: platform.label,
                id: platform.id,
            })),
        },
    ];

    const handleChange = (value: string[]) => {
        if (value.includes('ALL')) {
            const allPlatformIds = platformList.map((platform) => platform.id);
            props.onChange?.(allPlatformIds);
        } else {
            props.onChange?.(value);
        }
    };

    return <Select {...props} options={options} onChange={handleChange} />;
}
