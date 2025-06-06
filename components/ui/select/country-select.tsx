import useModalStore from '@/hooks/use-modal';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function CountrySelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const fakeCountry: SelectProps['options'] = [
        {
            id: 1,
            value: 'Việt Nam',
            label: 'Việt Nam',
        },
        {
            id: 2,
            value: 'United State',
            label: 'United State',
        },
        {
            id: 3,
            value: 'France',
            label: 'France',
        },
        {
            id: 4,
            value: 'Thailand',
            label: 'Thailand',
        },
    ];
    return <Select {...props} options={fakeCountry} />;
}
