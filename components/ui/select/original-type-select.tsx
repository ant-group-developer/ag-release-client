import useModalStore from '@/hooks/use-modal';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {};

export enum OriginType {
    ORIGINAL = 'original',
    COVER = 'cover',
    REMIX = 'remix',
}

export default function OriginalTypeSelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    return (
        <Select
            {...props}
            options={Object.values(OriginType).map((item) => ({
                id: item,
                value: item,
                label: item,
            }))}
        />
    );
}
